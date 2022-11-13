import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import AssignmentsIcon from '@material-ui/icons/SettingsApplications';

import i18n from '../../../languages';

const SettingsAssignmentsForm = (props) => {
  const {
    identifier,
    app,
    handleOnSubmit,
    handleOnChange,
    handleClose,
    isFetching,
  } = props;

  const actorType = identifier.split(':')[1].split('.')[0];

  return (
    <form onSubmit={handleOnSubmit}>
      <Card variant="outlined">
        <CardHeader
          title={
            <Typography variant="h5">
              {app.name}
            </Typography>
          }
          subheader={i18n.t(`${actorType}:mTitle`)}
          avatar={
            <Avatar>
              <AssignmentsIcon />
            </Avatar>
          }
        />
        <CardContent>
          <FormControl margin="normal" fullWidth>
            <InputLabel id={`settings-assignment-actor-${actorType}-app-${app.id}-label`}>
              {app.name}
            </InputLabel>
            <Select
              labelId={`settings-assignment-actor-${actorType}-app-${app.id}-label`}
              name="access"
              value={app.access}
              onChange={handleOnChange}
              label={app.name}
            >
              {app.is_optional &&
                <MenuItem value={0}>
                  {i18n.t('settings:assignment.options.optional')}
                </MenuItem>}
              <MenuItem value={1}>
                {i18n.t('settings:assignment.options.always')}
              </MenuItem>
              <MenuItem value={2}>
                {i18n.t('settings:assignment.options.never')}
              </MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            onClick={handleClose}
            fullWidth
          >
            Close
          </Button>
          <Button
            type="submit"
            fullWidth
            color="primary"
            variant="contained"
            disabled={isFetching}
          >
            {i18n.t('actions:update')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

SettingsAssignmentsForm.propTypes = {
  identifier: PropTypes.string.isRequired,
  app: PropTypes.objectOf(PropTypes.any).isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default SettingsAssignmentsForm;
