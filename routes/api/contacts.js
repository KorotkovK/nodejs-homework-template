
const express = require('express');
const router = express.Router();
const contactsModel = require('../../models/contacts');

router.get('/', async (req, res) => {
  const contacts = await contactsModel.listContacts();
  res.json(contacts);
});

router.get('/:id', async (req, res) => {
  const contact = await contactsModel.getContactById(req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

router.post('/', async (req, res) => {
  const result = await contactsModel.addContact(req.body);
  res.status(result.status).json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await contactsModel.removeContact(req.params.id);
  res.status(result.status).json(result);
});

router.put('/:id', async (req, res) => {
  const result = await contactsModel.updateContact(req.params.id, req.body);
  res.status(result.status).json(result);
});

module.exports = router;
