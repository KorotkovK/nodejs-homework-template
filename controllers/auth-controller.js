import fs from 'fs/promises';
import path from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from 'jimp';
import { nanoid } from 'nanoid';
import "dotenv/config.js";
import User from "../models/User.js";
import { HttpError, sendEmail } from '../helpers/index.js';


const { JWT_SECRET, BASE_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");


const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			throw HttpError(409, "Email in use");
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const verificationToken = nanoid();

		const gravatarURL = gravatar.url(email, { d: 'identicon' });

		const newUser = await User.create({ ...req.body, password: hashPassword, verificationToken, avatarURL: gravatarURL });

		const verifyEmail = {
			to: email,
			subject: "Verify email",
			html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
		};

		await sendEmail(verifyEmail);

		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		})
	} catch (error) {
		next(error);
	}
}

const verify = async (req, res, next) => {
	try {
		const { verificationToken } = req.params;
		const user = await User.findOne({ verificationToken });
		if (!user) {
			throw HttpError(404, "User not found");
		}
		await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

		res.json({
			message: "Verification successful"
		})

	} catch (error) {
		next(error);
	}
}

const resendVerifyEmail = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			throw HttpError(404, "Email not found");
		}
		if (user.verify) {
			throw HttpError(400, "Verification has already been passed");
		}

		const verifyEmail = {
			to: email,
			subject: "Verify email",
			html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
		};

		await sendEmail(verifyEmail);

		res.json({
			message: "Verification email sent"
		})

	} catch (error) {
		next(error);
	}
}

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			throw HttpError(401, "Email or password is wrong");
		}

		if (!user.verify) {
			throw HttpError(401, "Email not verify");
		}

		const passwordCompare = await bcrypt.compare(password, user.password);
		if (!passwordCompare) {
			throw HttpError(401, "Email or password is wrong");
		}

		const { _id: id } = user;
		const payload = {
			id
		};
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
		await User.findByIdAndUpdate(id, { token });

		res.json({
			token: token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		})

	} catch (error) {
		next(error);
	}
}

const getCurrent = async (req, res, next) => {
	const { email, subscription } = req.user;
	res.json({
		email,
		subscription,
	})
}

const logout = async (req, res, next) => {
	try {
		const { _id } = req.user;
		await User.findByIdAndUpdate(_id, { token: null });
		res.status(204).json();
	} catch (error) {
		next(error);
	}
}

const updateUserSubscription = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const user = await User.findByIdAndUpdate(_id, req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
}

const updateAvatar = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { path: oldPath, filename } = req.file;
		const newPath = path.join(avatarPath, filename);

		const avatar = await Jimp.read(oldPath);
		await avatar.resize(250, 250).writeAsync(newPath);

		await fs.unlink(oldPath);

		const newAvatarURL = path.join("avatars", filename);

		await User.findByIdAndUpdate(_id, { avatarURL: newAvatarURL });
		res.json({
			avatarURL: newAvatarURL,
		});
	} catch (error) {
		next(error);
	}
}

export default {
	register,
	verify,
	resendVerifyEmail,
	login,
	getCurrent,
	logout,
	updateUserSubscription,
	updateAvatar,
}