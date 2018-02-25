import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {},
  media: {
    height: theme.spacing.unit * 20,
  },
  avatar: {
    textDecoration: 'none',
  },
  title: {
    fontSize: 16,
  },
  titleLink: {
    textDecoration: 'none',
    color: theme.palette.primary,
  },
});

let ActorTitle = (props) => {
  const { to, name, classes } = props;
  return (
    <Link to={to} href={to} className={classes.titleLink}>
      {name}
    </Link>
  );
};

ActorTitle = withStyles(styles)(ActorTitle);

ActorTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const ActorCard = (props) => {
  const {
    classes,
    name,
    alias,
    description,
    avatar,
    cover,
    profile,
    action,
  } = props;

  const nameInitial = name.charAt(0).toUpperCase();

  return (
    <div className={classes.root}>
      <Card>
        {cover &&
          <Link to={profile} href={profile}>
            <CardMedia
              className={classes.media}
              image={cover}
              title={name}
            />
          </Link>
        }
        <CardHeader
          avatar={
            <Avatar
              aria-label={name}
              className={classes.avatar}
              alt={name}
              src={avatar}
              component={Link}
              to={profile}
            >
              {!avatar && nameInitial}
            </Avatar>
          }
          action={action}
          title={<ActorTitle
            classes={classes}
            to={profile}
            name={name}
          />}
          subheader={`@${alias}`}
        />
        {description &&
        <CardContent>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        }
      </Card>
    </div>
  );
};

ActorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  cover: PropTypes.string,
  profile: PropTypes.string.isRequired,
  action: PropTypes.node,
};

ActorCard.defaultProps = {
  alias: '',
  description: '',
  avatar: '',
  cover: '',
  action: null,
};

export default withStyles(styles)(ActorCard);
