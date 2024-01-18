import { userAuthSchema } from "../schemas/user-schemas.js";
import { HttpError } from "../helpers/index.js";

const validateUserAuthSchema = (req, res, next) => {
	const { error } = userAuthSchema.validate(req.body);
	if (error) {
		return next(HttpError(400, error.message));
	}
	next();
};

export default validateUserAuthSchema;