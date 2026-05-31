import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: '23eg112e53@anurag.edu.in',
        pass: 'ayxaffegmroulzwo'
    }
})

async function sendemail(to, sub, msg) {
    try {
        const info = await transporter.sendMail({
            from: '23eg112e53@anurag.edu.in',
            to,
            subject: sub,
            html: msg
        })

        console.log('MAIL SENT:', info.response)

    } catch (err) {

        console.error('MAIL ERROR:', err)

    }
}

export default sendemail
