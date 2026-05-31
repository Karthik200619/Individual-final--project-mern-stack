import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth:{
        user:'23eg112e53@anurag.edu.in',
        pass:'ayxaffegmroulzwo'
    }
})
async function sendemail(to, sub, msg) {

    await transporter.sendMail({
        to:to,
        subject: sub,
        html: msg
    })

}
export default sendemail;