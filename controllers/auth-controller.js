import fs from 'fs/promises';
import path from 'path';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from 'jimp';
import "dotenv/config.js";
import User from "../models/User.js";
import { HttpError } from '../helpers/index.js';


const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");


const register = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			throw HttpError(409, "Email in use");
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const gravatarURL = gravatar.url(email, { d: 'identicon' });

		const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL: gravatarURL });

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

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			throw HttpError(401, "Email or password is wrong");
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
	login,
	getCurrent,
	logout,
	updateUserSubscription,
	updateAvatar,
}