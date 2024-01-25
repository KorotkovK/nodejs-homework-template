import Contact from '../models/Contact.js';
import { HttpError } from '../helpers/index.js';


const getAll = async (req, res, next) => {
	try {
		const { _id: owner } = req.user;
		const searchCriteria = { owner };
		const { page = 1, limit = 5, favorite } = req.query;
		const skip = (page - 1) * limit;
		if (favorite) {
			searchCriteria.favorite = favorite;
		}
		const result = await Contact.find(searchCriteria, "", { skip, limit });
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const getById = async (req, res, next) => {
	try {
		const { contactId: _id } = req.params;
		const { _id: owner } = req.user;
		const result = await Contact.findOne({ _id, owner });
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const add = async (req, res, next) => {
	try {
		const { _id: owner } = req.user;
		const result = await Contact.create({ ...req.body, owner });
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
}

const deleteById = async (req, res, next) => {
	try {
		const { contactId: _id } = req.params;
		const { _id: owner } = req.user;
		const result = await Contact.findOneAndDelete({ _id, owner });
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json({ message: "contact deleted" });
	} catch (error) {
		next(error);
	}
}

const updateById = async (req, res, next) => {
	try {
		const { contactId: _id } = req.params;
		const { _id: owner } = req.user;
		const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const updateStatusContact = async (req, res, next) => {
	try {
		const { contactId: _id } = req.params;
		const { _id: owner } = req.user;
		const result = await Contact.findOneAndUpdate({ _id, owner }, req.body);
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

export default {
	getAll,
	getById,
	add,
	deleteById,
	updateById,
	updateStatusContact,
}