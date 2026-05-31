import exp from 'express'
import { authenticatelogin } from '../Service/authService.js';
import { VerifyToken } from '../middlewares/VerifyToken.js';
import { UserModel } from '../models/UserModel.js';
import generateOTP from '../Service/createPassCrypto.js';
import sendemail from '../config/nodemailer.js';
import {hash} from 'bcryptjs'
import { OtpModel } from '../models/OtpModel.js';
export const CommonApi = exp.Router()

// login
CommonApi.post('/login', async (req, res) => {
    let loginObj = req.body;
    let { user, token } = await authenticatelogin({ loginObj });
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
    res.status(200).json({ message: 'login successfull', payload: user })
})
// logout
CommonApi.get('/logout', async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
    res.status(200).json({ message: 'logout successfull' })
})

// refresh
CommonApi.get('/refresh', VerifyToken, async (req, res) => {

    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
        message: 'refresh successful',
        payload: user
    });
});

// forget password
// first get email 
CommonApi.post('/forgetpass', async (req, res) => {
    // check if user exists with the email or not if does exists return true or else fasle
    const { email } = req.body
    // check if user exists with the email or not
    const user = await UserModel.findOne({ email })
    if (user === null) {
        const verifiedObj = {
            email: null,
            isPresent: false
        }
        res.status(200).json({ message: 'user withe email not exists', payload: verifiedObj })
        return
    }
    // if does the user exists 
    const verifiedObj = {
        email: email,
        isPresent: true
    }
    res.status(200).json({ message: 'user exists with the email', payload: verifiedObj })
})
// now if the frontend gets true it will make a axios call to the get otp by email
// if user exists with that email we are sending and otp to verify the user
CommonApi.post('/sendotp', async (req, res) => {

    const { email } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    const otp = generateOTP()

    await OtpModel.create({
        email,
        otp,
        purpose:'RESET_PASSWORD',
        verified: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    })

    const message = `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes</p>
    `
    sendemail(email,
        'Reset Password OTP',
        message)

    res.status(200).json({
        message: 'OTP sent successfully'
    })

})

CommonApi.post('/verify-register-otp',async(req,res)=>{
    const { email, otp } = req.body
    const otpData =
    await OtpModel.findOne({
        email,
        otp,
        purpose:'REGISTER'

    })
    if(!otpData){
        return res.status(400).json({
            message:'Invalid OTP'
        })

    }

    if(
        otpData.expiresAt <
        new Date()
    ){

        return res.status(400).json({
            message:'OTP expired'
        })

    }

    await UserModel.updateOne(

        { email },

        {
            isEmailVerified:true
        }

    )

    await OtpModel.deleteMany({
        email,
        purpose:'REGISTER'
    })

    res.status(200).json({
        message:'Email verified successfully'
    })

})


// after sending otp lets verify otp 
CommonApi.post('/verifyotp', async (req, res) => {

    const { email, otp } = req.body

    const otpData = await OtpModel.findOne({
        email,
        otp,
        purpose:'RESET_PASSWORD',
    })

    if (!otpData) {
        return res.status(400).json({
            message: 'Invalid OTP'
        })
    }

    if (otpData.expiresAt < new Date()) {
        return res.status(400).json({
            message: 'OTP expired'
        })
    }

    otpData.verified = true

    await otpData.save()

    res.status(200).json({
        message: 'OTP verified'
    })

})
// verify and update password
CommonApi.post('/resetpassword', async (req, res) => {

    const { email, password } = req.body

    const verifiedOtp = await OtpModel.findOne({
        email,
        verified: true
    })

    if (!verifiedOtp) {
        return res.status(401).json({
            message: 'OTP verification required'
        })
    }

    const hashedPassword = await hash(password, 12)

    await UserModel.updateOne(
        { email },
        { password: hashedPassword }
    )

    await OtpModel.deleteOne({ email })

    res.status(200).json({
        message: 'Password reset successful'
    })

})
