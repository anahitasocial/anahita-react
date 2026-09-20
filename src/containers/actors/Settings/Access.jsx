import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';

import AccessIcon from '@material-ui/icons/Visibility';

import ActorType from '../../../proptypes/Actor';
import actions from '../../../actions';
import i18n from '../../../languages';
import utils from '../../../utils';
import { Access as ACCESS } from '../../../constants';

// The access levels where asking to follow is a meaningful thing to
// offer. Public and registered profiles are already visible to the
// person asking, so there is nothing for a request to unlock.
const OPEN_TO_EVERYONE = [
  ACCESS.ACTORS.PUBLIC,
  ACCESS.ACTORS.REGISTERED,
];

const ActorsSettingsAccess = (props) => {
  const {
    editAccess,
    alertError,
    alertSuccess,
    actor,
    namespace,
  } = props;

  const actorType = utils.node.isPerson(actor) ? 'PEOPLE' : 'ACTORS';
  const accessOptions = _.values(ACCESS[actorType]);

  const [access, setAccess] = useState(actor.access || ACCESS.ACTORS.PUBLIC);

  // Defaulted rather than taken raw. The server omitted this field
  // whenever it was false — omitempty on a bool — so it arrived
  // undefined, made the Switch uncontrolled, and was posted as the
  // string "undefined", which cannot bind to a bool and took the whole
  // request down with a 400. The response no longer omits it; this
  // keeps the card working against a server that has not been updated.
  const [allowFollowRequest, setAllowFollowRequest] = useState(
    Boolean(actor.allowFollowRequest),
  );
  const [waiting, setWaiting] = useState(false);

  // No confirmation step.
  //
  // There was one, and it asked a question the page already answers:
  // every level is on screen with a sentence saying who it admits, and
  // the choice is a radio button next to that sentence. A dialog
  // repeating "are you sure" after somebody has read six options and
  // picked one teaches them to dismiss dialogs, which is worse than
  // not having asked.
  //
  // It is also reversible in one click, unlike the Danger zone
  // actions, which is where confirmation earns its place.
  const handleOnSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    setWaiting(true);

    return editAccess({
      ...actor,
      access,
      allowFollowRequest,
    }).then(() => {
      alertSuccess(i18n.t('actor:access.alerts.success'));
    }).catch(() => {
      alertError(i18n.t('actor:access.alerts.error'));
    }).finally(() => {
      setWaiting(false);
    });
  };

  const followRequestDisabled = OPEN_TO_EVERYONE.includes(access);

  return (
    <form onSubmit={handleOnSubmit}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <AccessIcon />
            </Avatar>
          }
          titleTypographyProps={{ variant: 'h5' }}
          title={i18n.t('actor:access.title')}
          subheader={i18n.t('actor:access.cDescription')}
        />
        <Divider />

        {/* A radio list rather than a select.
            Each level needs a sentence to be chosen sensibly —
            "Mutuals" does not tell somebody who that is — and a
            dropdown can only show a sentence once it has been
            opened, one option at a time. Laid out as rows, they can
            be compared, which is the whole task. */}
        <RadioGroup
          // Namespaced, so the person and group forms cannot share a
          // radio group name if both are ever on one page.
          name={`${namespace}-access`}
          aria-label={i18n.t('actor:access.labels.whoCanSee')}
          value={access}
          onChange={(event) => {
            setAccess(event.target.value);
          }}
        >
          <List disablePadding>
            {accessOptions.map((option) => {
              return (
                <ListItem
                  key={`access-${option}`}
                  button
                  divider
                  onClick={() => {
                    setAccess(option);
                  }}
                >
                  <ListItemIcon>
                    <Radio
                      checked={access === option}
                      value={option}
                      color="primary"
                      inputProps={{
                        'aria-label': i18n.t(`access:${option}`),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t(`access:${option}`)}
                    secondary={i18n.t(`actor:access.descriptions.${option}`)}
                  />
                </ListItem>
              );
            })}
          </List>
        </RadioGroup>

        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={allowFollowRequest}
                onChange={(event) => {
                  setAllowFollowRequest(event.target.checked);
                }}
                name="allowFollowRequest"
                color="primary"
                // Nothing to unlock when the profile is already
                // visible to whoever would be asking.
                disabled={followRequestDisabled}
              />
            }
            label={i18n.t('actor:access.labels.othersCanRequestToFollow')}
          />
        </ListItem>

        <Divider />
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={waiting}
            fullWidth
          >
            {i18n.t('actions:update')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ActorsSettingsAccess.propTypes = {
  actor: ActorType.isRequired,
  editAccess: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    return {
      actor,
      namespace,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      editAccess: (params) => {
        return dispatch(actions[namespace].settings.access.edit(params));
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
  )(ActorsSettingsAccess);
};
