const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,         // Use 587 (STARTTLS) — port 465 is blocked on Render
            secure: false,     // false = STARTTLS upgrade after connection
            requireTLS: true,  // enforce TLS upgrade
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // avoids cert issues on some hosts
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
