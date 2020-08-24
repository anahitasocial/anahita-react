import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
import SimpleSnackbar from '../../../components/SimpleSnackbar';

import PrivacyType from '../../../proptypes/actor/Privacy';
import ActorType from '../../../proptypes/Actor';
import * as actions from '../../../actions';
import i18n from '../../../languages';
import ACCESS from '../../../constants/access';

const accessOptions = {
  people: [
    ACCESS.PEOPLE.PUBLIC,
    ACCESS.PEOPLE.REGISTERED,
    ACCESS.PEOPLE.FOLLOWERS,
    ACCESS.PEOPLE.LEADERS,
    ACCESS.PEOPLE.MUTUALS,
    ACCESS.PEOPLE.ADMINS,
  ],
  groups: [
    ACCESS.GROUPS.PUBLIC,
    ACCESS.GROUPS.REGISTERED,
    ACCESS.GROUPS.FOLLOWERS,
    ACCESS.GROUPS.ADMINS,
  ],
};

const ActorsSettingsPrivacy = (props) => {
  const {
    readPrivacy,
    editPrivacy,
    privacy,
    actor,
    isFetching,
    success,
    error,
    namespace,
  } = props;

  const [entity, setEntity] = useState(privacy);

  useEffect(() => {
    readPrivacy(actor);
  }, [readPrivacy, actor]);

  const handleOnChange = (event) => {
    const {
      target: {
        name,
        value,
        type,
        checked,
      },
    } = event;

    privacy[name] = (type === 'checked') ? checked : value;

    setEntity({
      ...entity,
      [name]: type === 'checked' ? checked : value,
    });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    editPrivacy({ actor, privacy });
  };

  if (privacy.access === '' && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      <form onSubmit={handleOnSubmit}>
        <Card>
          <CardContent>
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                id={`${namespace}-privacy-access-label-id`}
              >
                Who can see this profile?
              </InputLabel>
              <Select
                id={`${namespace}-privacy-access-id`}
                labelId={`${namespace}-privacy-access-label-id`}
                name="access"
                value={privacy.access}
                onChange={handleOnChange}
                label="Who can see this profile?"
              >
                {accessOptions[namespace].map((option) => {
                  const key = `people-privacy-access-${option}`;
                  return (
                    <MenuItem
                      key={key}
                      value={option}
                    >
                      {i18n.t(`access:people.${option}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  value={privacy.allowFollowRequest}
                  onChange={handleOnChange}
                  name="allowFollowRequest"
                  disabled={[
                    ACCESS.PEOPLE.PUBLIC,
                    ACCESS.PEOPLE.REGISTERED,
                  ].includes(privacy.access)}
                />
              }
              label="Others can request to follow"
            />
            {actor.isAdministrated &&
              <FormControl
                fullWidth
                margin="normal"
              >
                <InputLabel
                  id={`${namespace}-privacy-leadable-add-label-id`}
                >
                  Who can can add new followers?
                </InputLabel>
                <Select
                  id={`${namespace}-privacy-leadable-add-id`}
                  labelId={`${namespace}-privacy-leadable-add-label-id`}
                  name="leadable:add"
                  value={privacy['leadable:add']}
                  onChange={handleOnChange}
                  label="Who can can add new followers?"
                >
                  {accessOptions[namespace].map((option) => {
                    const key = `people-privacy-leadable-add-${option}`;
                    return (
                      <MenuItem
                        key={key}
                        value={option}
                      >
                        {i18n.t(`access:${namespace}.${option}`)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            }
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isFetching}
              fullWidth
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </form>
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Updated successfully!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

ActorsSettingsPrivacy.propTypes = {
  actor: ActorType.isRequired,
  readPrivacy: PropTypes.func.isRequired,
  editPrivacy: PropTypes.func.isRequired,
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
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsPrivacy);
};
