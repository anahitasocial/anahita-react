import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Card, {
  CardHeader,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';

const styles = {
  root: {
    width: '100%',
  },
  avatar: {
    textDecoration: 'none',
  },
};

const ActorSettingCard = (props) => {
  const {
    classes,
    actor,
    namespace,
    children,
  } = props;

  const avatarSrc = actor.imageURL.medium && actor.imageURL.medium.url;
  const initials = actor.name.charAt(0);

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              aria-label={actor.name}
              className={classes.avatar}
              alt={actor.name}
              src={avatarSrc}
              component={Link}
              to={`/${namespace}/${actor.id}/`}
            >
              {!avatarSrc && initials}
            </Avatar>
          }
          title={actor.name}
          subheader="Settings"
        />
        <Divider />
        {children}
      </Card>
    </div>
  );
};

ActorSettingCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(ActorSettingCard);
