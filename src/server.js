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
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id=${contactId}!`,
        data: contact,
      });
    } catch (error) {
      if (error.message.includes('Cast to ObjectId')) {
        error.status = 404;
      }
      const { status = 500 } = error;
      res.status(status).json({ message: error.message });
    }
  });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
