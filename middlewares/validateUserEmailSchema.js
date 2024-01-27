import { userEmailSchema } from "../schemas/user-schemas.js";
import { HttpError } from "../helpers/index.js";

const validateUserEmailSchema = (req, res, next) => {
	const { error } = userEmailSchema.validate(req.body);
	if (error) {
		return next(HttpError(400, error.message));
	}
	next();
};

export default validateUserEmailSchema;