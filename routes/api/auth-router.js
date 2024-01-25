import express from "express";
import authController from "../../controllers/auth-controller.js";
import {
	isEmptyBody,
	validateUserAuthSchema,
	authenticate,
	validateUserUpdateSubscriptionsSchema,
	upload
} from '../../middlewares/index.js';


const authRouter = express.Router();


authRouter.post("/register", isEmptyBody, validateUserAuthSchema, authController.register);

authRouter.post("/login", isEmptyBody, validateUserAuthSchema, authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/", authenticate, validateUserUpdateSubscriptionsSchema, authController.updateUserSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);


export default authRouter;