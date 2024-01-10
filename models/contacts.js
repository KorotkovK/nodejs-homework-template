// models/contacts.js
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((c) => c.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((c) => c.id === contactId);

  if (contactIndex === -1) {
    return { message: 'Not found', status: 404 };
  }

  contacts.splice(contactIndex, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return { message: 'Contact deleted', status: 200 };
};

const addContact = async (body) => {
  const { name, email, phone } = body;

  if (!name) {
    return { message: 'Missing required name field', status: 400 };
  }

  if (!email) {
    return { message: 'Missing required email field', status: 400 };
  }

  if (!phone) {
    return { message: 'Missing required phone field', status: 400 };
  }

  const contacts = await listContacts();
  const existingContact = contacts.find((c) => c.email === email);

  if (existingContact) {
    return { message: 'Contact with this email already exists', status: 400 };
  }

  // Validate email format (you may add more validations)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { message: 'Invalid email format', status: 400 };
  }

  const newContact = { ...body, id: uuidv4() };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return { ...newContact, status: 201 };
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((c) => c.id === contactId);

  if (contactIndex === -1) {
    return { message: 'Not found', status: 404 };
  }

  const { name, email, phone } = body;

  if (!name && !email && !phone) {
    return { message: 'Missing fields', status: 400 };
  }

  // Validate email format (you may add more validations)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if ('email' in body && !emailRegex.test(body.email)) {
    return { message: 'Invalid email format', status: 400 };
  }

  contacts[contactIndex] = { ...contacts[contactIndex], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return { ...contacts[contactIndex], status: 200 };
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
