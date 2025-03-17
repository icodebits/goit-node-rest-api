import nodemailer from "nodemailer";
import "dotenv/config";

const {MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_AUTH_USER, MAIL_AUTH_PASSWORD} = process.env;

const nodemailerConfig = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
        user: MAIL_AUTH_USER,
        pass: MAIL_AUTH_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: `GoIT API ${MAIL_AUTH_USER}`};
    return transport.sendMail(email);
}

export default sendEmail;