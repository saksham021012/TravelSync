const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, 
            port: 587,  
            secure: false, 
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"TravelSync" <${process.env.MAIL_USER}>`, 
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email Sent Successfully:", info);
        return info;

    } catch (error) {
        console.error("Error Sending Email:", error);
        return null; // Return null to prevent `undefined` errors
    }
};

module.exports = mailSender;
