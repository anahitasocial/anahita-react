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

// checkedValidity reports whether a control satisfies its constraints.
//
// The subtlety is willValidate === false, which the DOM sets for hidden
// inputs, disabled inputs, and anything else barred from constraint
// validation. That means "there is nothing to check", NOT "this failed" —
// and reading it as a failure is what silently jams a form: isValid comes
// back false, form.isValid() is false, and the submit handler quietly does
// nothing with no error anywhere to explain it.
const checkedValidity = (control) => {
  if (!control || control.willValidate === false) {
    return true;
  }

  if (typeof control.checkValidity !== 'function') {
    return true;
  }

  return control.checkValidity();
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
    : checkedValidity(field);

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
    // Collect every control with this name, rather than asking namedItem for
    // "the" one.
    //
    // Several controls share a name whenever there is a radio group, and what
    // namedItem hands back for that is not consistent: browsers return a
    // RadioNodeList, which has .value but none of the constraint API, while
    // jsdom returns the first element. Reading validity off the browser's
    // RadioNodeList yields undefined — falsy — so the submit was quietly
    // refused; reading the value off jsdom's first element gives whichever
    // radio happens to be first rather than the one that is checked.
    //
    // That is what jammed the person settings form: touching the usertype
    // radios adds "usertype" to the field list, and from then on every save
    // did nothing, with no error anywhere to explain it.
    //
    // Filtering form.elements ourselves sidesteps both. It also skips
    // HTMLFormElement's own properties — name, method, action — which the
    // original form[key] lookup could return instead of an input.
    const controls = _.filter(form.elements, (element) => {
      return element.name === key;
    });

    // A declared field with no control in the form carries no constraint to
    // violate: keep its value and treat it as valid, or the form can never
    // be submitted.
    if (controls.length === 0) {
      newFields[key] = {
        ...fields[key],
        isValid: true,
        error: '',
      };
      return;
    }

    // A group: the value is whichever member is checked, and '' when none is —
    // never the first member's, which is nobody's answer. Validity comes from
    // a member, since that is where the constraints live.
    const isGroup = controls.length > 1;
    const checkedControl = _.find(controls, (member) => { return member.checked; });
    const control = isGroup ? (checkedControl || controls[0]) : controls[0];

    let rawValue;
    if (isGroup) {
      rawValue = checkedControl ? checkedControl.value : '';
    } else if (control.type === 'checkbox') {
      rawValue = control.checked;
    } else {
      rawValue = control.value;
    }

    const isEmpty = rawValue === '' || rawValue === null || rawValue === undefined;
    const required = Boolean(control && control.required);
    const isValid = (!required && isEmpty)
      ? true
      : checkedValidity(control);

    newFields[key] = {
      ...fields[key],
      value: rawValue,
      isValid,
      error: isValid ? '' : (control && control.validationMessage) || '',
      required,
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
