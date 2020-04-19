import _ from 'lodash';

const formField = {
  value: '',
  isValid: false,
  error: '',
  helperText: '',
};

const createFormFields = (fields = []) => {
  const formFields = {};

  fields.forEach((field) => {
    formFields[field] = { ...formField };
  });

  return formFields;
};

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
    const field = form[key] || formField;

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

const fieldsToData = (fields) => {
  const keys = _.keys(fields);
  const entity = {};

  keys.forEach((key) => {
    entity[key] = fields[key].value;
  });

  return entity;
};

export default {
  createFormFields,
  validateField,
  validateForm,
  isValid,
  fieldsToData,
};
