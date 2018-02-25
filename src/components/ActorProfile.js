import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import withStyles from 'material-ui/styles/withStyles';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
//  CardActions,
} from 'material-ui/Card';
import { LinearProgress } from 'material-ui/Progress';
import Fade from 'material-ui/transitions/Fade';

const styles = theme => ({
  root: {
    width: '100%',
  },
  cover: {
    minHeight: 300,
  },
  coverLoader: {
    minHeight: 300,
    backgroundColor: theme.palette.background.default,
  },
  avatar: {
    width: theme.spacing.unit * 15,
    height: theme.spacing.unit * 15,
  },
  header: {},
});

class ActorProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coverLoaded: false,
    };

    this.cover = new Image();
  }

  componentDidMount() {
    this.cover.onload = () => {
      this.setState({
        coverLoaded: true,
      });
    };
    this.cover.onError = () => {
      this.setState({
        coverLoaded: false,
      });
    };
    this.cover.src = this.props.cover;
  }

  componentWillUnmount() {
    this.cover.onload = null;
    this.cover.onerror = null;
  }

  render() {
    const {
      classes,
      cover,
      avatar,
      name,
      alias,
      description,
      followAction,
    } = this.props;

    return (
      <div className={classes.root}>
        <Card>
          {this.state.coverLoaded &&
            <Fade in>
              <CardMedia
                className={classes.cover}
                title={name}
                image={this.cover.src}
              />
            </Fade>
          }
          {!this.state.coverLoaded && cover &&
            <div className={classes.coverLoader}>
              <LinearProgress className={classes.loader} />
            </div>
          }
          <CardHeader
            avatar={
              <Avatar
                aria-label={name}
                className={classes.avatar}
                alt={name}
                src={avatar}
              >
                {!avatar && name.charAt(0)}
              </Avatar>
            }
            action={followAction}
            title={name}
            subheader={`@${alias}`}
            className={classes.header}
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
  }
}

ActorProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  cover: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string,
  description: PropTypes.string,
  followAction: PropTypes.node,
};

ActorProfile.defaultProps = {
  cover: '',
  avatar: '',
  description: '',
  alias: '',
  followAction: null,
};

export default withStyles(styles)(ActorProfile);
