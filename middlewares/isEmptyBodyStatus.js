import { HttpError } from "../helpers/index.js";

const isEmptyBodyStatus = (req, res, next) => {
	if (!req.body.hasOwnProperty('favorite')) {
		return next(HttpError(400, "missing field favorite"));
	}
	next();
}

export default isEmptyBodyStatus;