import { userUpdateSubscriptionsSchema } from "../schemas/user-schemas.js";
import { HttpError } from "../helpers/index.js";

const validateUserUpdateSubscriptionsSchema = (req, res, next) => {
	const { error } = userUpdateSubscriptionsSchema.validate(req.body);
	if (error) {
		return next(HttpError(400, error.message));
	}
	next();
};

export default validateUserUpdateSubscriptionsSchema;