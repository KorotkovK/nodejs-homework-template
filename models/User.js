import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
	password: {
		type: String,
		match: passwordRegExp,
		required: [true, 'Password is required'],
	},
	email: {
		type: String,
		match: emailRegExp,
		required: [true, 'Email is required'],
		unique: true,
	},
	avatarURL: {
		type: String,
		default: null,
	},
	subscription: {
		type: String,
		enum: ["starter", "pro", "business"],
		default: "starter"
	},
	token: {
		type: String,
		default: null,
	},
	verify: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
	},
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;