import React from 'react';
import slugify from 'slugify';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import SocialgraphMeta from './socialgraph/Meta';
import ActorType from '../../proptypes/Actor';

const styles = (theme) => {
  return {
    hRoot: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
    },
    hAvatar: {
      marginTop: -theme.spacing(15),
    },
    hContent: {
      marginTop: theme.spacing(4),
    },
    hAction: {
      alignSelf: 'flex-end',
      marginTop: -theme.spacing(6),
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
    disabled: {
      borderColor: theme.palette.warning.light,
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
    <Card
      square
      className={!actor.enabled ? classes.disabled : ''}
    >
      {cover}
      <CardHeader
        classes={{
          root: classes.hRoot,
          avatar: classes.hAvatar,
          content: classes.hContent,
          action: classes.hAction,
        }}
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
          <>
            <Typography
              variant="h3"
              className={classes.subheader}
              align="center"
            >
              {actor.alias && `@${slugify(actor.alias.toLowerCase())}`}
            </Typography>
            <SocialgraphMeta actor={actor} />
          </>
        }
        action={headerActions}
      />
      {followAction &&
        <CardActions>
          <div className={classes.grow} />
          {followAction}
        </CardActions>}
    </Card>
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
