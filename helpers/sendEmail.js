import nodemailer from 'nodemailer';
import "dotenv/config.js";

const { FROM_EMAIL, PASSWORD_EMAIL } = process.env;

const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: FROM_EMAIL,
        pass: PASSWORD_EMAIL,
    },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = (email) => {
    transporter
        .sendMail({ ...email, from: FROM_EMAIL })
        .then(i => console.log(i))
        .catch(e => console.log(e.message));
}

