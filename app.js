/// Додати імпорт morgan
const morgan = require('morgan');

const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts');

const app = express();

// Вибір формату для logger в залежності від режиму
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// Використовуйте `morgan` (замість `logger`)
app.use(morgan(formatsLogger));

app.use(express.json());
app.use(cors());

app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
