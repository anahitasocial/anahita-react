import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';

import BackIcon from '@material-ui/icons/ArrowBackIos';

import utils from '../utils';

const {
  getActorInitials,
  getAvatarURL,
  getURL,
} = utils.node;

// Settings page chrome: the actor's name, avatar and a way back to the profile.
//
// children is optional. The person settings page stacks several cards under one
// section and passes none, using this purely as a header — nesting those cards
// inside this one would draw a card border around a column of card borders. The
// notifications editor still passes children and is unaffected.
const ActorSettingCard = ({
  actor,
  subheader = 'Settings',
  children = null,
}) => {
  const src = getAvatarURL(actor, 'medium');
  const initials = getActorInitials(actor);
  const url = getURL(actor);

  return (
    <Card>
      <CardHeader
        avatar={
          <Button
            href={url}
            variant="text"
            startIcon={<BackIcon />}
          >
            <Avatar
              aria-label={actor.name}
              alt={actor.name}
              src={src}
            >
              {!src && initials}
            </Avatar>
          </Button>
        }
        title={actor.name}
        subheader={subheader}
      />
      {/* Only when there is something to divide it from. Without the guard a
          header-only card ends on a rule with nothing under it. */}
      {children && <Divider />}
      {children}
    </Card>
  );
};

ActorSettingCard.propTypes = {
  actor: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  children: PropTypes.node,
};

export default ActorSettingCard;
