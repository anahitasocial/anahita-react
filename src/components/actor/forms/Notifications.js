import React from 'react';
import PropTypes from 'prop-types';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';

import i18n from '../../../languages';

const ActorsFormsNotifications = (props) => {
  const {
    namespace,
    emailMutedGlobally,
    sendEmail,
    isSubscribed,
    handleEditType,
    handleEdit,
  } = props;

  return (
    <>
      <FormControl margin="normal" fullWidth>
        <FormLabel component="legend">
          {i18n.t(`${namespace}:notifications.optionsTitle`)}
        </FormLabel>
        <RadioGroup
          aria-label="gender"
          value={isSubscribed ? 0 : 1}
          onChange={handleEditType}
        >
          <FormControlLabel
            value={0}
            control={<Radio />}
            label={i18n.t(`${namespace}:notifications.options.all`)}
          />
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={i18n.t(`${namespace}:notifications.options.following`)}
          />
        </RadioGroup>
      </FormControl>
      {!emailMutedGlobally &&
      <FormControlLabel
        control={
          <Switch
            checked={sendEmail}
            onChange={handleEdit}
            name="sendEmail"
          />
        }
        label={i18n.t(`${namespace}:notifications.email`)}
      />}
    </>
  );
};

ActorsFormsNotifications.propTypes = {
  namespace: PropTypes.string.isRequired,
  emailMutedGlobally: PropTypes.bool.isRequired,
  sendEmail: PropTypes.bool.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  handleEditType: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default ActorsFormsNotifications;
