import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    // отримуємо файл за допомогою readFileSync у вигляді буфера(в байтах),
    //за допомогою toString() перетворюємо в рядок, бо JSON.parse працює з рядками і перетвор в об'єкт
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
