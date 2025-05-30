import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER, // Your SMTP username
        pass: process.env.SMTP_PASSWORD, // Your SMTP password
    }, 
})




export default transporter;
// server/config/nodemailer.js 