import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import createHttpError from 'http-errors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import { errorHandler } from './middlerwares/errorHandler.js';
import { notFoundHandler } from './middlerwares/notFoundHandler.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, world!!!',
    });
  });

  app.get('/contacts', async (req, res, next) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id=${contactId}!`,
      data: contact,
    });
  });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
