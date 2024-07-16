import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { env } from './env.js';
import { readFile } from 'node:fs/promises';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'google-oauth.json'); // шлях до файла

const oauthConfig = JSON.parse(await readFile(PATH_JSON)); //прочитати вміст файла (JSON.parse=> отримуемо об'єкт)

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_AUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_AUTH_CLIENT_SECRET'),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

// ф-ція(бекенд), яка повертає посилання на гугл аутентифікацію
export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Unauthorized');
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getFullNameFromGoogleTokenPayload = ({
  given_name,
  family_name,
}) => {
  if (!given_name) return 'User';
  const name = family_name ? `${given_name} ${family_name}` : given_name;

  return name;
};
