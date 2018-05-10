import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import withStyles from 'material-ui/styles/withStyles';
import Card, {
  CardHeader,
  CardMedia,
  // CardContent,
  CardActions,
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
  header: {},
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 5,
  },
  alias: {
    fontSize: 16,
  },
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
      headerAction,
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
            avatar={avatar}
            title={
              <div className={classes.titleContainer}>
                <Typography variant="title" className={classes.title}>
                  {name}
                </Typography>
                <Typography
                  component="p"
                  className={classes.alias}
                >
                  {`@${alias}`}
                </Typography>
              </div>
            }
            subheader={description &&
              <Typography component="p">
                {description}
              </Typography>
            }
            className={classes.header}
            action={headerAction}
          />
          <CardActions>
            {followAction}
          </CardActions>
        </Card>
      </div>
    );
  }
}

ActorProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  cover: PropTypes.string,
  avatar: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  alias: PropTypes.string,
  description: PropTypes.string,
  followAction: PropTypes.node,
  headerAction: PropTypes.node,
};

ActorProfile.defaultProps = {
  cover: '',
  description: '',
  alias: '',
  followAction: null,
  headerAction: null,
};

export default withStyles(styles)(ActorProfile);
