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

const styles = theme => ({
  root: {},
  card: {
    marginBottom: 20,
  },
  media: {
    height: 150,
  },
});

const ActorCard = (props) => {
  const {
    classes,
    name,
    alias,
    description,
    avatar,
    cover,
    canFollow,
    isLeader,
    handleFollowActor,
    handleUnfollowActor,
  } = props;

  const nameInitial = name.charAt(0).toUpperCase();

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label={name}
              className={classes.avatar}
              alt={name}
              src={avatar}
            >
              {!avatar && nameInitial}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={name}
          subheader={`@${alias}`}
        />
        {cover &&
        <CardMedia className={classes.media} image={cover} title={name} />
        }
        {description &&
        <CardContent>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        }
        {canFollow &&
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
  handleFollowActor: PropTypes.func.isRequired,
  handleUnfollowActor: PropTypes.func.isRequired,
};

ActorCard.defaultProps = {
  alias: '',
  description: '',
  avatar: '',
  cover: '',
};

export default withStyles(styles)(ActorCard);
