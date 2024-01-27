import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
	destination,
	filename: (req, file, callback) => {
		const filename = `${Date.now()}_${file.originalname}`;
		callback(null, filename);
	}
});

const limits = {
	fileSize: 1024 * 1024,
};

const fileFilter = (req, file, callback) => {
	const extention = file.originalname.split(".").pop();
	if (extention === "exe") {
		callback(HttpError(400, ".exe is not valid extention"));
	}
	callback(null, true);
};

const upload = multer({
	storage,
	limits,
	fileFilter,
});

export default upload;