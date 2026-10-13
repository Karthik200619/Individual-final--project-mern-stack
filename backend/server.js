import exp from 'express'
import cookieParser from 'cookie-parser'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
import { UserApi } from './APIs/UserApi.js'
import { AdminApi } from './APIs/AdminApi.js'
import { CommonApi } from './APIs/CommonApi.js'

config()

const app = exp()

// Keep the deployed frontend and local development origins in sync with the API.
// CLIENT_ORIGIN can contain a comma-separated list of additional exact origins.
const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const allowedOrigins = new Set([
    'https://individual-final-project-mern-stack.vercel.app',
    'https://individual-final--project-mern-stack.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...configuredOrigins
])

const isCampusKartVercelPreview = (origin) =>
    /^https:\/\/individual-final--?project-mern-stack(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin)

app.disable('x-powered-by')

// CORS must run before the API routers so preflight OPTIONS requests are handled too.
app.use(cors({
    origin(origin, callback) {
        // Requests without Origin (e.g. server-to-server/health checks) are not browser CORS requests.
        if (!origin || allowedOrigins.has(origin) || isCampusKartVercelPreview(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true
}))

// middleware
app.use(exp.json({ limit: '1mb' }))
app.use(cookieParser())

// APIs (paths and response formats intentionally unchanged)
app.use('/user-api', UserApi)
app.use('/admin-api', AdminApi)
app.use('/common-api', CommonApi)

// not-found handler
app.use((req, res) => {
    res.status(404).json({ message: `${req.originalUrl} is invalid path` })
})

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({ message: 'error occurred', error: err.message })
    }

    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue

    if (errCode === 11000) {
        const field = keyValue ? Object.keys(keyValue)[0] : undefined
        const value = field ? keyValue[field] : undefined
        return res.status(409).json({
            message: 'error occurred',
            error: field ? `${field} "${value}" already exists` : 'Duplicate value'
        })
    }

    if (err.status) {
        return res.status(err.status).json({ message: 'error occurred', error: err.message })
    }

    console.error('API error:', err)
    return res.status(500).json({ message: 'error occurred', error: 'Server side error' })
})

// function to connect Database
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log('connected to Database successfully')
        const port = process.env.PORT || 5000
        app.listen(port, () => {
            console.log(`server started at PORT ${port}`)
        })
    } catch (err) {
        console.error('Database connection failed:', err.message)
        process.exitCode = 1
    }
}

connectDB()

export default app
