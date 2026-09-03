/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import TotpCard from './TotpCard';
import TotpSteps from './TotpSteps';
import { Totp as TOTP } from '../../../constants';
import form from '../../../utils/form';
import api from '../../../api';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

const {
  STEPS: {
    PAIR_DEVICE,
    DOWNLOAD_RECOVERY_CODES,
    ENABLED,
  },
} = TOTP;

const passwordFormFields = form.createFormFields([
  'password',
]);

const pairingFormFields = form.createFormFields([
  'passcode',
]);

const Totp = ({ viewer }) => {
  const [activeStep, setActiveStep] = useState(null);

  // Collapsed by default. The wizard is three steps deep and opening it
  // unprompted on a settings page is a lot of screen for something most
  // visits do not need — same reasoning as the password and email cards.
  const [isEnrolling, setIsEnrolling] = useState(false);

  // null until the server answers, which is what TotpCard renders as loading.
  // Reading enrolment from GET /totp rather than from the session viewer:
  // viewer.totpEnabled does not exist anywhere in this app, which is the bug
  // that left the step-up dialog unable to ask a TOTP user for a passcode.
  const [enabled, setEnabled] = useState(null);

  const readStatus = () => {
    return api.totp.read()
      .then((response) => {
        setEnabled(Boolean(response.data && response.data.data && response.data.data.enabled));
      })
      .catch(() => {
        // Degrade to "off". The card then offers enrolment, and a person who
        // is already enrolled finds out at the password step rather than being
        // told, wrongly and permanently, that the request failed.
        setEnabled(false);
      });
  };

  useEffect(() => {
    readStatus();
  }, []);

  const [passwordFields, setPasswordFields] = useState(passwordFormFields);
  const [pairingFields, setPairingFields] = useState(pairingFormFields);
  const [qrImage, setQrImage] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  // The final step has no form field to hang an error off, so it gets
  // its own message slot.
  const [enableError, setEnableError] = useState('');

  const handleEnable = () => {
    setActiveStep(null);
    setIsEnrolling(true);
  };

  // Leaving the wizard re-reads the status instead of assuming it. Done is
  // reachable from the final step, where enrolment did complete, but also
  // after a cancel partway through, where it did not.
  const handleDone = () => {
    setIsEnrolling(false);
    setActiveStep(null);
    readStatus();
  };

  const handleOnChangePassword = (event) => {
    const { target } = event;

    const trimmed = ['password'];
    const newPasswordFields = form.validateField(target, passwordFields, trimmed);

    setPasswordFields({ ...newPasswordFields });
  };

  // setFieldError puts an API failure back onto the field that caused
  // it. Both step forms already render `error`/`helperText` off the
  // field (see FormPassword and FormPairing), so this is all it takes
  // to make a rejected request visible — previously every failure went
  // to the console and the Continue button just appeared to do nothing.
  const setFieldError = (setFields, name, message) => {
    setFields((fields) => {
      return {
        ...fields,
        [name]: { ...fields[name], isValid: false, error: message },
      };
    });
  };

  const handleOnSubmitPassword = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, passwordFields);

    if (form.isValid(newFields)) {
      const data = form.fieldsToData(newFields);
      api.totp.add(data.password)
        .then((response) => {
          setQrImage(response.data);
          setActiveStep(PAIR_DEVICE);
        }).catch((err) => {
          // 406 is specifically "password did not match"; anything else
          // is a validation or server problem the user cannot act on as
          // precisely, so keep that message generic.
          const status = err.response && err.response.status;
          setFieldError(
            setPasswordFields,
            'password',
            status === 406
              ? i18n.t('auth:totp.errors.wrongPassword')
              : i18n.t('auth:totp.errors.passwordInvalid'),
          );
        });
    }
  };

  const handleOnChangePasscode = (event) => {
    const { target } = event;

    const trimmed = ['passcode'];
    const newPairingFields = form.validateField(target, pairingFields, trimmed);

    setPairingFields({ ...newPairingFields });
  };

  const prepareRecoveryCodesContent = (items) => {
    const service = process.env.REACT_APP_NAME;
    const account = viewer.email;

    let content = i18n.t('auth:totp.recoveryCodes.content', {
      service,
      account,
    });

    items.map((code) => {
      content += `${code}\n`;
      return content;
    });

    return content;
  };

  const handleOnSubmitPasscode = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, pairingFields);

    if (form.isValid(newFields)) {
      const data = form.fieldsToData(newFields);
      api.totp.addRecoveryCodes(data.passcode)
        .then((response) => {
          setRecoveryCodes(response.data);
          setActiveStep(DOWNLOAD_RECOVERY_CODES);
        }).catch(() => {
          // Stay on this step with the QR still on screen so the user
          // can read a fresh code off their authenticator and retry.
          setFieldError(
            setPairingFields,
            'passcode',
            i18n.t('auth:totp.errors.invalidPasscode'),
          );
        });
    }
  };

  const handleDownloadRecoveryCodes = () => {
    if (!recoveryCodes) {
      return;
    }

    const content = prepareRecoveryCodesContent(recoveryCodes);
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.download = 'recoveryCodes.txt';
    link.href = url;
    link.click();
  };

  const handleCopyRecoveryCodes = () => {
    if (!recoveryCodes) {
      return;
    }

    const textField = document.createElement('textarea');
    textField.innerHTML = prepareRecoveryCodesContent(recoveryCodes);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setCopySuccess(true);
    const delayTime = 3000; // 3 seconds
    setTimeout(() => {
      setCopySuccess(false);
    }, delayTime);
  };

  const handleEnableTOTP = () => {
    api.totp.edit()
      .then(() => {
        setActiveStep(ENABLED);
      }).catch(() => {
        setEnableError(i18n.t('auth:totp.errors.enableFailed'));
      });
  };

  if (!isEnrolling) {
    return (
      <TotpCard
        loading={enabled === null}
        enabled={enabled === true}
        onEnable={handleEnable}
      />
    );
  }

  return (
    <TotpSteps
      handleDone={handleDone}
      handleOnSubmitPassword={handleOnSubmitPassword}
      handleOnChangePassword={handleOnChangePassword}
      handleOnSubmitPasscode={handleOnSubmitPasscode}
      handleOnChangePasscode={handleOnChangePasscode}
      handleCopyRecoveryCodes={handleCopyRecoveryCodes}
      handleDownloadRecoveryCodes={handleDownloadRecoveryCodes}
      handleEnableTOTP={handleEnableTOTP}
      activeStep={activeStep}
      passwordFields={passwordFields}
      pairingFields={pairingFields}
      qrCodeImage={qrImage}
      recoveryCodes={recoveryCodes}
      codesCopySuccess={copySuccess}
      enableError={enableError}
    />
  );
};

Totp.propTypes = {
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.session;

  return {
    viewer,
  };
};

function mapDispatchToProps() {
  return {};
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(Totp));
