import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import {
	isEmptyBody,
	isEmptyBodyStatus,
	isValidId,
	validateContactAddSchema,
	validateContactUpdateSchema,
	validateContactUpdateFavoriteSchema,
	authenticate
} from '../../middlewares/index.js';


const contactsRouter = express.Router();

contactsRouter.use(authenticate);


contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateContactAddSchema, contactsController.add);

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById);

contactsRouter.put('/:contactId', isEmptyBody, isValidId, validateContactUpdateSchema, contactsController.updateById);

contactsRouter.patch('/:contactId/favorite', isEmptyBodyStatus, isValidId, validateContactUpdateFavoriteSchema, contactsController.updateStatusContact);


export default contactsRouter;
