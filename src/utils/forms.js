import _ from 'lodash';
import defaultField from '../formfields/field';

const validateField = (field, fields, trimmed = []) => {
  const { name, value } = field;

  return {
    ...fields,
    [name]: {
      value: trimmed.includes(name) ? value.trim() : value,
      isValid: field.willValidate && field.checkValidity(),
      error: field.validationMessage,
    },
  };
};

const validateForm = (form, fields) => {
  const keys = _.keys(fields);
  const newFields = { ...fields };

  keys.forEach((key) => {
    const field = form[key] || defaultField;

    newFields[key].value = field.value;
    newFields[key].isValid = field.willValidate && field.checkValidity();
    newFields[key].error = field.validationMessage;
  });

  return newFields;
};

const isValid = (fields) => {
  const keys = _.keys(fields);

  return keys.filter((key) => {
    return fields[key].isValid === false;
  }).length === 0;
};

export default {
  validateField,
  validateForm,
  isValid,
};
