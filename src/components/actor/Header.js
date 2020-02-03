import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import ActorType from '../../proptypes/Actor';

const styles = (theme) => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
    },
    avatar: {
      marginTop: -theme.spacing(15),
    },
    content: {
      marginTop: theme.spacing(4),
    },
    action: {
      position: 'absolute',
      alignSelf: 'flex-end',
    },
    title: {
      fontSize: 24,
      fontWeight: 600,
    },
    subheader: {
      fontSize: 18,
    },
    grow: {
      flex: '1 1 auto',
    },
  };
};

const ActorHeader = (props) => {
  const {
    classes,
    cover,
    avatar,
    actor,
    followAction,
    headerActions,
  } = props;

  return (
    <React.Fragment>
      <Card>
        {cover}
        <CardHeader
          classes={classes}
          avatar={avatar}
          title={
            <Typography
              variant="h2"
              className={classes.title}
              align="center"
            >
              {actor.name}
            </Typography>
          }
          subheader={
            <Typography
              variant="h3"
              className={classes.subheader}
              align="center"
            >
              {actor.alias && `@${actor.alias}`}
            </Typography>
          }
          action={headerActions}
        />
        {followAction &&
          <CardActions>
            <Box className={classes.grow} />
            {followAction}
          </CardActions>
        }
      </Card>
    </React.Fragment>
  );
};

ActorHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  cover: PropTypes.node.isRequired,
  avatar: PropTypes.node.isRequired,
  actor: ActorType.isRequired,
  followAction: PropTypes.node,
  headerActions: PropTypes.node,
};

ActorHeader.defaultProps = {
  followAction: null,
  headerActions: null,
};

export default withStyles(styles)(ActorHeader);
