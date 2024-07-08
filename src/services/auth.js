import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const user = UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError('409', 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError('404', 'User not found');
  }

  const isEquil = await bcrypt.compare(payload.password, user.password);

  if (!isEquil) {
    throw createHttpError('401', 'Unauthorized');
  }

  // delete previous session

  await SessionsCollection.deleteOne({ userId: user._id });

  // генерація нових токенів доступу і оновлення

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  // ф-ція створює нову сесію

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};