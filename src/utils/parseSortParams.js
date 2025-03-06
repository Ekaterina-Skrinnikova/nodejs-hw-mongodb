import { contactsFieldList, sortOrderList } from '../constants/contacts.js';

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const parsedSortBy = contactsFieldList.includes(sortBy)
    ? sortBy
    : contactsFieldList[0];

  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
