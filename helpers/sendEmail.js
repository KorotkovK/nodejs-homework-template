import nodemailer from "nodemailer";
import "dotenv/config.js";

const { MAIL_PASSWORD, MAIL_FROM, MAIL_TO } = process.env;

const nodemailerConfig = {
	service: 'gmail',
	auth: {
		user: MAIL_FROM,
		pass: MAIL_PASSWORD,
	},
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
	const email = { ...data, from: MAIL_FROM };
	return transport.sendMail(email);
};

export default sendEmail;