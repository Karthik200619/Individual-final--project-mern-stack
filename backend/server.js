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

// middleware's
// 1.body-parser middleware
app.use(exp.json())
// 2.cookie-parser middleware
app.use(cookieParser())
//
app.use(cors({
    origin: ['https://individual-final-project-mern-stack.vercel.app'],
    credentials: true
    
}))

// API's
app.use('/user-api', UserApi)
app.use('/admin-api', AdminApi)
app.use('/common-api', CommonApi)


// function to connect Database
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log('connected to Database successfully')
        // listen takes in total 2 Parameters one is PORT No and another is call back 
        app.listen(process.env.PORT, () => {
            console.log(`server started at PORT ${process.env.PORT}`)
        })
    } catch (err) {
        console.log(err)
    }
}
connectDB()

//dealing with invalid path
app.use((req, res, next) => {
    console.log(req.url);
    res.json({ message: `${req.url} is invalid path` });
});

//error handling middleware
app.use((err, req, res, next) => {
    console.log("Error name:", err.name);
    console.log("Error code:", err.code);
    console.log("Full error:", err);

    // mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    // mongoose cast error
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

    if (errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return res.status(409).json({
            message: "error occurred",
            error: `${field} "${value}" already exists`,
        });
    }

    // ✅ HANDLE CUSTOM ERRORS
    if (err.status) {
        return res.status(err.status).json({
            message: "error occurred",
            error: err.message,
        });
    }

    // default server error
    res.status(500).json({
        message: "error occurred",
        error: "Server side error",
    });
});

