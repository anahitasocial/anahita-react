import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';

const styles = {
  avatar: {},
  avatarLinked: {
    textDecoration: 'none',
  },
};

const ActorAvatar = (props) => {
  const {
    classes,
    actor,
    linked,
  } = props;

  const namespace = actor.objectType.split('.')[1];
  const actorId = (namespace === 'people') ? actor.alias : actor.id;
  const avatarSrc = actor.imageURL.medium && actor.imageURL.medium.url;

  let initials = '';
  if (namespace === 'people') {
    initials = `${actor.givenName.charAt(0).toUpperCase()}${actor.familyName.charAt(0).toUpperCase()}`;
  } else {
    initials = actor.name.charAt(0).toUpperCase();
  }

  return (
    <React.Fragment>
      {linked &&
        <Avatar
          aria-label={actor.name}
          className={classes.avatarLinked}
          alt={actor.name}
          src={avatarSrc}
          component={Link}
          to={`/${namespace}/${actorId}/`}
        >
          {!avatarSrc && initials}
        </Avatar>
      }
      {!linked &&
        <Avatar
          aria-label={actor.name}
          className={classes.avatar}
          alt={actor.name}
          src={avatarSrc}
        >
          {!avatarSrc && initials}
        </Avatar>
      }
    </React.Fragment>
  );
};

ActorAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object,
  linked: PropTypes.bool,
};

ActorAvatar.defaultProps = {
  actor: {
    id: null,
    name: '',
    givenName: '',
    familyName: '',
    alias: '',
    namespace: 'com.people.person',
  },
  linked: false,
};

export default withStyles(styles)(ActorAvatar);
