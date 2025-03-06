import { favouriteList, typeList } from '../constants/contacts.js';

const parseType = (value) => {
  if (typeof value !== 'string') return;

  if (!typeList.includes(value)) return;

  return value;
};

const parseFavourite = (value) => {
  if (typeof value !== 'string') return;

  if (!favouriteList.includes(value)) return;

  return Boolean(value);
};

export const parseFilterParams = (query, userId) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedFavourite = parseFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedFavourite,
    userId,
  };
};
