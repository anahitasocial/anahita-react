import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  media: {
    height: theme.spacing.unit * 20,
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
    canFollow,
    isLeader,
    isAuthenticated,
    handleFollowActor,
    handleUnfollowActor,
  } = props;

  const nameInitial = name.charAt(0).toUpperCase();

  return (
    <div className={classes.root}>
      <Card>
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
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={<ActorTitle
            classes={classes}
            to={profile}
            name={name}
          />}
          subheader={`@${alias}`}
        />
        {cover &&
        <CardMedia
          className={classes.media}
          image={cover}
          title={name}
        />
        }
        {description &&
        <CardContent>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        }
        {isAuthenticated && canFollow &&
        <CardActions>
          {isLeader &&
          <Button
            color="inherit"
            onClick={handleUnfollowActor}
          >
            Unfollow
          </Button>
          }
          {!isLeader &&
          <Button
            dense
            color="primary"
            onClick={handleFollowActor}
          >
            Follow
          </Button>
          }
        </CardActions>
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
  canFollow: PropTypes.bool.isRequired,
  isLeader: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  handleFollowActor: PropTypes.func.isRequired,
  handleUnfollowActor: PropTypes.func.isRequired,
  profile: PropTypes.string.isRequired,
};

ActorCard.defaultProps = {
  alias: '',
  description: '',
  avatar: '',
  cover: '',
};

export default withStyles(styles)(ActorCard);
