import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Link } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import TOTPIcon from '@material-ui/icons/PhonelinkLock';
import CopyIcon from '@material-ui/icons/FileCopy';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import i18n from '../../../languages';
import { Totp as TOTP } from '../../../constants';
import PersonType from '../../../proptypes/Person';

import FormPassword from './FormPassword';
import FormPairing from './FormPairing';
import RecoveryCodes from './RecoveryCodes';

const useStyles = makeStyles((theme) => {
  return {
    stepper: {
      padding: theme.spacing(2),
    },
  };
});

const { STEPS } = TOTP;

const TotpSteps = ({
  handleOnSubmitPassword,
  handleOnChangePassword,
  handleOnSubmitPasscode,
  handleOnChangePasscode,
  handleDownloadRecoveryCodes,
  handleCopyRecoveryCodes,
  handleEnableTOTP,
  activeStep = STEPS.PAIR_DEVICE,
  passwordFields,
  pairingFields,
  qrCodeImage = null,
  recoveryCodes = [],
  codesCopySuccess = false,
  enableError = '',
  viewer,
}) => {
  const classes = useStyles();

  const steps = {
    [STEPS.PAIR_DEVICE]: i18n.t('auth:totp.steps.pairDevice'),
    [STEPS.DOWNLOAD_RECOVERY_CODES]: i18n.t('auth:totp.steps.downloadRecoveryCodes'),
    [STEPS.ENABLED]: i18n.t('auth:totp.steps.enabled'),
  };

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar>
            <TOTPIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6">
            {i18n.t('auth:totp.steps.cTitle')}
          </Typography>
        }
      />
      <Stepper
        activeStep={Object.keys(steps).indexOf(activeStep)}
        alternativeLabel
        className={classes.stepper}
      >
        {Object.keys(steps).map((key) => {
          return (
            <Step key={key}>
              <StepLabel>{steps[key]}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {!activeStep &&
        <form onSubmit={handleOnSubmitPassword} noValidate autoComplete="off">
          <CardContent>
            <FormPassword
              fields={passwordFields}
              handleOnChange={handleOnChangePassword}
            />
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
            >
              {i18n.t('actions:continue')}
            </Button>
          </CardActions>
        </form>}
      {activeStep === STEPS.PAIR_DEVICE &&
        <form onSubmit={handleOnSubmitPasscode} noValidate autoComplete="off">
          <CardContent>
            <FormPairing
              fields={pairingFields}
              handleOnChange={handleOnChangePasscode}
              qrCodeImage={qrCodeImage}
            />
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
            >
              {i18n.t('actions:continue')}
            </Button>
          </CardActions>
        </form>}
      {activeStep === STEPS.DOWNLOAD_RECOVERY_CODES &&
        <>
          <CardContent>
            <RecoveryCodes items={recoveryCodes} />
            {enableError !== '' &&
              <Typography variant="body2" color="error">
                {enableError}
              </Typography>}
          </CardContent>
          <CardActions>
            <Button
              startIcon={<CopyIcon />}
              type="submit"
              variant="outlined"
              fullWidth
              onClick={handleCopyRecoveryCodes}
              color={codesCopySuccess ? 'secondary' : 'default'}
            >
              {codesCopySuccess ? i18n.t('auth:totp.recoveryCodes.prompts.copySuccess') : i18n.t('auth:totp.recoveryCodes.prompts.copyCodes')}
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              fullWidth
              onClick={handleDownloadRecoveryCodes}
            >
              {i18n.t('actions:download')}
            </Button>
          </CardActions>
          <CardActions>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              onClick={handleEnableTOTP}
            >
              {i18n.t('auth:totp.recoveryCodes.prompts.enableTotp')}
            </Button>
          </CardActions>
        </>}
      {activeStep === STEPS.ENABLED &&
        <>
          <CardContent>
            <Typography variant="h5" align="center">
              {i18n.t('auth:totp.enable.cDesc')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={`/people/${viewer.id}/`}
              fullWidth
              color="primary"
              variant="contained"
            >
              {i18n.t('actions:done')}
            </Button>
          </CardActions>
        </>}
    </Card>
  );
};

TotpSteps.propTypes = {
  handleOnSubmitPassword: PropTypes.func.isRequired,
  handleOnChangePassword: PropTypes.func.isRequired,
  handleOnSubmitPasscode: PropTypes.func.isRequired,
  handleOnChangePasscode: PropTypes.func.isRequired,
  handleDownloadRecoveryCodes: PropTypes.func.isRequired,
  handleCopyRecoveryCodes: PropTypes.func.isRequired,
  handleEnableTOTP: PropTypes.func.isRequired,
  activeStep: PropTypes.oneOf([
    STEPS.PAIR_DEVICE,
    STEPS.DOWNLOAD_RECOVERY_CODES,
    STEPS.ENABLED,
  ]),
  passwordFields: PropTypes.objectOf(PropTypes.any).isRequired,
  pairingFields: PropTypes.objectOf(PropTypes.any).isRequired,
  qrCodeImage: PropTypes.object,
  recoveryCodes: PropTypes.arrayOf(PropTypes.string),
  codesCopySuccess: PropTypes.bool,
  enableError: PropTypes.string,
  viewer: PersonType.isRequired,
};

export default TotpSteps;
