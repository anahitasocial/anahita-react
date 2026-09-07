import _ from 'lodash';

const formField = {
  value: '',
  isValid: false,
  error: '',
  helperText: '',
  required: false,
  touched: false,
};

const createFormFields = (fields = [], defaults = {}) => {
  const formFields = {};

  fields.forEach((field) => {
    formFields[field] = {
      ...formField,
      value: defaults[field] !== undefined ? defaults[field] : '',
    };
  });

  return formFields;
};

const validateField = (field, fields, trimmed = []) => {
  const { name } = field;
  const rawValue = field.type === 'checkbox' ? field.checked : field.value;
  const value = trimmed.includes(name) && typeof rawValue === 'string'
    ? rawValue.trim()
    : rawValue;

  const isEmpty = value === '' || value === null || value === undefined;
  const isValid = (!field.required && isEmpty)
    ? true
    : field.willValidate && field.checkValidity();

  return {
    ...fields,
    [name]: {
      ...fields[name],
      value,
      isValid,
      error: isValid ? '' : field.validationMessage,
      required: field.required,
      touched: true,
    },
  };
};

const validateForm = (form, fields) => {
  const keys = _.keys(fields);
  const newFields = {};

  keys.forEach((key) => {
    // namedItem() only ever looks at the form's controls, unlike form[key],
    // which falls back to HTMLFormElement's own properties (name, method, ...).
    const field = form.elements.namedItem(key);

    // A declared field with no control in the form carries no constraint to
    // violate: keep its value and treat it as valid, or the form can never
    // be submitted.
    if (!field) {
      newFields[key] = {
        ...fields[key],
        isValid: true,
        error: '',
      };
      return;
    }

    const rawValue = field.type === 'checkbox' ? field.checked : field.value;
    const isEmpty = rawValue === '' || rawValue === null || rawValue === undefined;
    const isValid = (!field.required && isEmpty)
      ? true
      : field.willValidate && field.checkValidity();

    newFields[key] = {
      ...fields[key],
      value: rawValue,
      isValid,
      error: isValid ? '' : field.validationMessage,
      required: field.required,
      touched: true,
    };
  });

  return newFields;
};

const isValid = (fields) => {
  return _.every(fields, (f) => { return f.isValid; });
};

const fieldsToData = (fields) => {
  return _.mapValues(fields, 'value');
};

const dataToFields = (data, fields) => {
  const newFields = {};

  _.keys(fields).forEach((key) => {
    newFields[key] = {
      ...fields[key],
      value: key in data ? data[key] : fields[key].value,
    };
  });

  return newFields;
};

export default {
  createFormFields,
  validateField,
  validateForm,
  isValid,
  fieldsToData,
  dataToFields,
};
