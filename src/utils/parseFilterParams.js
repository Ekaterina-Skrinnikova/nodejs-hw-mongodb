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

export const parseFilterParams = ({ contactType, isFavourite }) => {
  const parsedType = parseType(contactType);
  const parsedFavourite = parseFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedFavourite,
  };
};
