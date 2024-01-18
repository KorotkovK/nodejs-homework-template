import { contactUpdateSchema } from "../schemas/contact-schemas.js";
import { HttpError } from "../helpers/index.js";

const validateContactUpdateSchema = (req, res, next) => {
	const { error } = contactUpdateSchema.validate(req.body);
	if (error) {
		return next(HttpError(400, error.message));
	}
	next();
};

export default validateContactUpdateSchema;