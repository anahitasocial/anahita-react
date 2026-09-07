/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import form from '../form';

const buildForm = (html) => {
  document.body.innerHTML = `<form>${html}</form>`;
  return document.querySelector('form');
};

describe('validateForm', () => {
  // The bug the user hit: touching the usertype radios adds "usertype" to the
  // field list, and every save afterwards did nothing, silently.
  it('validates a radio group instead of choking on the RadioNodeList', () => {
    const el = buildForm(`
      <input type="radio" name="usertype" value="registered">
      <input type="radio" name="usertype" value="administrator" checked>
      <input type="radio" name="usertype" value="super-administrator">
      <input name="givenName" value="Ada">
    `);

    const fields = form.createFormFields(['givenName', 'usertype']);
    const out = form.validateForm(el, fields);

    expect(out.usertype.value).toBe('administrator');
    expect(out.usertype.isValid).toBe(true);
    expect(form.isValid(out)).toBe(true);
  });

  it('reports the empty value when no radio is checked', () => {
    const el = buildForm(`
      <input type="radio" name="usertype" value="registered">
      <input type="radio" name="usertype" value="administrator">
    `);

    const out = form.validateForm(el, form.createFormFields(['usertype']));
    expect(out.usertype.value).toBe('');
    // Not required, and empty, so nothing to violate.
    expect(out.usertype.isValid).toBe(true);
  });

  // A hidden input is barred from constraint validation, so willValidate is
  // false. Reading that as "failed" blocked the submit just as surely.
  it('treats a hidden input as valid rather than failed', () => {
    const el = buildForm('<input type="hidden" name="usertype" value="administrator">');

    const out = form.validateForm(el, form.createFormFields(['usertype']));
    expect(out.usertype.value).toBe('administrator');
    expect(out.usertype.isValid).toBe(true);
  });

  it('treats a disabled input as valid rather than failed', () => {
    const el = buildForm('<input name="givenName" value="Ada" disabled>');

    const out = form.validateForm(el, form.createFormFields(['givenName']));
    expect(out.givenName.isValid).toBe(true);
  });

  // And it must still catch a genuine violation.
  it('still fails a required field left empty', () => {
    const el = buildForm('<input name="givenName" value="" required>');

    const out = form.validateForm(el, form.createFormFields(['givenName']));
    expect(out.givenName.isValid).toBe(false);
    expect(form.isValid(out)).toBe(false);
  });

  it('still fails a value that violates a pattern', () => {
    const el = buildForm('<input name="givenName" value="!!" pattern="[a-z]+" required>');

    const out = form.validateForm(el, form.createFormFields(['givenName']));
    expect(out.givenName.isValid).toBe(false);
  });

  it('reads a checkbox by checked, not value', () => {
    const el = buildForm('<input type="checkbox" name="enabled" checked>');

    const out = form.validateForm(el, form.createFormFields(['enabled']));
    expect(out.enabled.value).toBe(true);
  });
});
