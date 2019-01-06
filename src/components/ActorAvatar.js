import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link } from 'react-router-dom';
import ActorType from '../proptypes/Actor';

const ActorAvatar = (props) => {
  const {
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
        <ButtonBase
          component={Link}
          to={`/${namespace}/${actorId}/`}
        >
          <Avatar
            aria-label={actor.name}
            alt={actor.name}
            src={avatarSrc}
          >
            {!avatarSrc && initials}
          </Avatar>
        </ButtonBase>
      }
      {!linked &&
        <Avatar
          aria-label={actor.name}
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
  actor: ActorType.isRequired,
  linked: PropTypes.bool,
};

ActorAvatar.defaultProps = {
  linked: false,
};

export default ActorAvatar;
