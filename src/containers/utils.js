
const OWNER_NAME_CHAR_LIMIT = 16;

const getOwnerName = (node) => {
  const { owner: { name } } = node;
  if (name.length > OWNER_NAME_CHAR_LIMIT) {
    return `${name.substring(0, OWNER_NAME_CHAR_LIMIT)}...`;
  }
  return name;
};

const getColumnWidthPercentage = (width) => {
  let columnWidth = '100%';

  if (width === 'md') {
    columnWidth = '50%';
  } else if (width === 'lg') {
    columnWidth = '33.33%';
  } else if (width === 'xl') {
    columnWidth = '25%';
  }

  return columnWidth;
};

export default {
  getOwnerName,
  getColumnWidthPercentage,
};
