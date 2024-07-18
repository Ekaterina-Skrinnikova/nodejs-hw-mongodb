import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlerwares/errorHandler.js';
import { notFoundHandler } from './middlerwares/notFoundHandler.js';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlerwares/swaggerDocs.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR)); //можливість передавати статичні файли
  app.use('/api-docs', swaggerDocs());

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

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
