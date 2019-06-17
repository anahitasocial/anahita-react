import { getName } from 'country-list';

const getAddress = (node) => {
  const fields = [];

  if (node.address) {
    fields.push(node.address);
  }

  if (node.city) {
    fields.push(node.city);
  }

  if (node.province) {
    fields.push(node.province);
  }

  if (node.country) {
    fields.push(getName(node.country));
  }

  return fields.join(', ');
};

export default {
  getAddress,
};
