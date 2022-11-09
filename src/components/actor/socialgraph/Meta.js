import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import ActorType from '../../../proptypes/Actor';
import utils from '../../../utils';
import i18n from '../../../languages';

const { getURL } = utils.node;

const styles = (theme) => {
  return {
    root: {
      margin: theme.spacing(2),
      fontSize: 16,
    },
    space: {
      marginLeft: theme.spacing(),
      marginRight: theme.spacing(),
    },
  };
};

const SocialgraphMeta = (props) => {
  const { actor, classes } = props;
  const isPerson = actor.objectType.split('.')[1] === 'people';
  const actorURL = getURL(actor);

  return (
    <Typography
      variant="h4"
      align="center"
      className={classes.root}
    >
      <b>{`${i18n.t('socialgraph:followers')}: `}</b>
      <Link
        href={`${actorURL}socialgraph/followers/`}
        underline="none"
      >
        {actor.followerCount}
      </Link>
      {isPerson && <span className={classes.space} />}
      {isPerson && <b>{`${i18n.t('socialgraph:leaders')}: `}</b>}
      {isPerson &&
        <Link
          href={`${actorURL}socialgraph/leaders/`}
          underline="none"
        >
          {actor.followerCount}
        </Link>}
    </Typography>
  );
};

SocialgraphMeta.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
};

export default withStyles(styles)(SocialgraphMeta);
