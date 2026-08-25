import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import api from '../../../api';
import form from '../../../utils/form';
import i18n from '../../../languages';
import TotpForm from './TotpForm';

const totpFormFields = form.createFormFields([
  'passcode',
]);

const TotpVerify = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const returnPathFromQuery = queryParams.get('return');

  const [isFetching, setIsFetching] = useState(false);
  const [passcodeFields, setPasscodeFields] = useState(totpFormFields);

  const handleOnChangePasscode = (event) => {
    const { target } = event;

    // Validate against current state, not the pristine module-level
    // template — otherwise each keystroke recomputes from a blank field
    // and any error already on it silently disappears.
    const trimmed = ['passcode'];
    const newPasscodeFields = form.validateField(target, passcodeFields, trimmed);

    setPasscodeFields({ ...newPasscodeFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, passcodeFields);

    if (form.isValid(newFields)) {
      const data = form.fieldsToData(newFields);
      setIsFetching(true);

      api.totp.verify(data.passcode)
        .then((response) => {
          setIsFetching(false);
          if (response.status === 200) {
            window.location.href = returnPathFromQuery || '/';
          }
        })
        .catch(() => {
          setIsFetching(false);
          setPasscodeFields((fields) => {
            return {
              ...fields,
              passcode: {
                ...fields.passcode,
                isValid: false,
                error: i18n.t('auth:totp.errors.invalidPasscode'),
              },
            };
          });
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <TotpForm
        handleOnChange={handleOnChangePasscode}
        handleOnSubmit={handleOnSubmit}
        fields={passcodeFields}
        isFetching={isFetching}
      />
    </Container>
  );
};

export default TotpVerify;
