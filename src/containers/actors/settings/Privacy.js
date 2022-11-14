import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import Progress from '../../../components/Progress';
import DialogAlert from '../../../components/DialogAlert';

import PrivacyType from '../../../proptypes/actor/Privacy';
import ActorType from '../../../proptypes/Actor';
import actions from '../../../actions';
import i18n from '../../../languages';
import utils from '../../../utils';
import { Access as ACCESS } from '../../../constants';

const ActorsSettingsPrivacy = (props) => {
  const {
    readPrivacy,
    editPrivacy,
    alertError,
    alertSuccess,
    privacy,
    actor,
    isFetching,
    success,
    error,
    namespace,
  } = props;

  const actorType = utils.node.isPerson(actor) ? 'PEOPLE' : 'ACTORS';
  const accessOptions = _.values(ACCESS[actorType]);

  const [entity, setEntity] = useState(privacy);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    readPrivacy(actor);
  }, [readPrivacy, actor]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  const handleOnChange = (event) => {
    const {
      target: {
        name,
        value,
        type,
        checked,
      },
    } = event;

    privacy[name] = (type === 'checkbox') ? checked : value;

    if (name === 'access' && value === accessOptions[0]) {
      setShowDialog(true);
    }

    setEntity({
      ...entity,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    editPrivacy({ actor, privacy }).then(() => {
      setShowDialog(false);
    });
  };

  const handleDismiss = () => {
    setShowDialog(false);
  };

  if (privacy.access === '' && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <>
      <DialogAlert
        title={i18n.t('actor:privacyAlert.title')}
        content={i18n.t('actor:privacyAlert.content')}
        handleConfirm={handleOnSubmit}
        handleDismiss={handleDismiss}
        open={showDialog}
      />
      <form onSubmit={handleOnSubmit}>
        <Card variant="outlined">
          <CardContent>
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                id={`${namespace}-privacy-access-label-id`}
              >
                {i18n.t('actor:privacy.labels.whoCanSee')}
              </InputLabel>
              <Select
                id={`${namespace}-privacy-access-id`}
                labelId={`${namespace}-privacy-access-label-id`}
                name="access"
                value={privacy.access}
                onChange={handleOnChange}
                label={i18n.t('actor:privacy.labels.whoCanSee')}
              >
                {accessOptions.map((option) => {
                  const optionKey = `privacy-${option}`;
                  return (
                    <MenuItem
                      key={optionKey}
                      value={option}
                    >
                      {i18n.t(`access:${option}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={privacy.allowFollowRequest}
                  onChange={handleOnChange}
                  name="allowFollowRequest"
                  disabled={[
                    ACCESS.ACTORS.PUBLIC,
                    ACCESS.ACTORS.REGISTERED,
                  ].includes(privacy.access)}
                />
              }
              label={i18n.t('actor:privacy.labels.othersCanRequestToFollow')}
            />
            {actor.isAdministrated &&
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel
                  id={`${namespace}-privacy-leadable-add-label-id`}
                >
                  {i18n.t('actor:privacy.labels.whoCanAddNewFollowers')}
                </InputLabel>
                <Select
                  id={`${namespace}-privacy-leadable-add-id`}
                  labelId={`${namespace}-privacy-leadable-add-label-id`}
                  name="leadable:add"
                  value={privacy['leadable:add']}
                  onChange={handleOnChange}
                  label={i18n.t('actor:privacy.labels.whoCanAddNewFollowers')}
                >
                  {Object.keys(accessOptions).map((key) => {
                    const option = accessOptions[key];
                    return (
                      <MenuItem
                        key={`people-privacy-leadable-add-${option}`}
                        value={option}
                      >
                        {i18n.t(`access:${option}`)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>}
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isFetching}
              fullWidth
            >
              {i18n.t('actions:update')}
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

ActorsSettingsPrivacy.propTypes = {
  actor: ActorType.isRequired,
  readPrivacy: PropTypes.func.isRequired,
  editPrivacy: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  privacy: PrivacyType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    const {
      [`${namespace}_privacy`]: {
        current: privacy,
      },
      isFetching,
      error,
      success,
    } = state[`${namespace}Privacy`];

    return {
      actor,
      privacy,
      namespace,
      error,
      success,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readPrivacy: (actor) => {
        return dispatch(actions[namespace].settings.privacy.read(actor));
      },
      editPrivacy: (params) => {
        return dispatch(actions[namespace].settings.privacy.edit(params));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsPrivacy);
};
