import _ from 'lodash';

const formField = {
  value: '',
  isValid: false,
  error: '',
  helperText: '',
  required: false,
};

const createFormFields = (fields = []) => {
  const formFields = {};

  fields.forEach((field) => {
    formFields[field] = { ...formField };
  });

  return formFields;
};

const validateField = (field, fields, trimmed = []) => {
  const { name } = field;
  const value = trimmed.includes(name) ? field.value.trim() : field.value;
  const isValid = (!field.required && field.value === '') ? true : field.willValidate && field.checkValidity();

  return {
    ...fields,
    [name]: {
      value,
      isValid,
      error: field.validationMessage,
      required: field.required,
    },
  };
};

const validateForm = (form, fields) => {
  const keys = _.keys(fields);
  const newFields = { ...fields };

  keys.forEach((key) => {
    const field = form[key] || formField;
    const isValid = (!field.required && field.value === '') ? true : field.willValidate && field.checkValidity();

    console.log(isValid);

    newFields[key].value = field.value;
    newFields[key].isValid = isValid;
    newFields[key].error = field.validationMessage;
    newFields[key].required = field.required;
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

const dataToFields = (data, fields) => {
  const newFields = { ...fields };
  const keys = _.keys(newFields);

  keys.forEach((key) => {
    if (data[key]) {
      newFields[key].value = data[key];
    }
  });

  return fields;
};

export default {
  createFormFields,
  validateField,
  validateForm,
  isValid,
  fieldsToData,
  dataToFields,
};
