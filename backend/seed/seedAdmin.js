import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { hash } from 'bcryptjs'
import { UserModel } from '../models/UserModel.js'
import { CampusModel } from '../models/CampusModel.js'

dotenv.config()

const required = ['DB_URL', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_PHONE']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

const email = process.env.ADMIN_EMAIL.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const campusDomain = (process.env.ADMIN_CAMPUS_DOMAIN || email.split('@')[1] || '').trim().toLowerCase()
const phoneNo = Number(process.env.ADMIN_PHONE)

if (!Number.isFinite(phoneNo) || phoneNo <= 0) {
    throw new Error('ADMIN_PHONE must be a valid numeric phone number.')
}
if (!email.endsWith(`@${campusDomain}`)) {
    throw new Error('ADMIN_EMAIL must use the configured campus email domain.')
}
if (password.length < 8 || password.length > 128 ||
    !/[a-z]/.test(password) || !/[A-Z]/.test(password) ||
    !/\d/.test(password) || !/[@$!%*?&]/.test(password)) {
    throw new Error('ADMIN_PASSWORD must be 8–128 characters and include uppercase, lowercase, number, and special character.')
}

try {
    await mongoose.connect(process.env.DB_URL)

    const campus = await CampusModel.findOne({ campusEmailDomain: campusDomain, isApproved: true })
    if (!campus) {
        throw new Error(`No approved campus found for domain "${campusDomain}". Run npm run seed:campuses first, or set ADMIN_CAMPUS_DOMAIN to an existing approved campus domain.`)
    }

    const existingByEmail = await UserModel.findOne({ email })
    const existingByPhone = await UserModel.findOne({ phoneNo })
    if (existingByPhone && (!existingByEmail || !existingByPhone._id.equals(existingByEmail._id))) {
        throw new Error('ADMIN_PHONE is already assigned to another account. Choose a different phone number.')
    }

    const userData = {
        firstname: process.env.ADMIN_FIRSTNAME || 'Campus',
        lastname: process.env.ADMIN_LASTNAME || 'Admin',
        email,
        phoneNo,
        campus: campus._id,
        gender: process.env.ADMIN_GENDER || 'OTHERS',
        role: 'ADMIN',
        isActive: true,
        password: await hash(password, 12),
    }

    if (existingByEmail) {
        Object.assign(existingByEmail, userData)
        await existingByEmail.save()
        console.log('Existing account updated to ADMIN role.')
    } else {
        await UserModel.create(userData)
        console.log('Admin account created.')
    }

    console.log(`Admin ready: ${email} (campus: ${campus.campusName}). Password was not printed.`)
} finally {
    await mongoose.disconnect()
}
