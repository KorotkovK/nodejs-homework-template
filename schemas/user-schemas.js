import Joi from "joi";

const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userAuthSchema = Joi.object({
	password: Joi.string().pattern(passwordRegExp).required().messages({
		"any.required": `"missing required password field"`
	}),
	email: Joi.string().pattern(emailRegExp).required().messages({
		"any.required": `"missing required email field"`
	}),
});

export const userUpdateSubscriptionsSchema = Joi.object({
	subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});