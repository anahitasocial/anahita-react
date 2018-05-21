import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = {
  root: {},
  link: {
    textDecoration: 'none',
  },
};

const ActorTitle = (props) => {
  const {
    classes,
    actor,
    linked,
    variant,
    typographyProps,
  } = props;

  const namespace = actor.objectType.split('.')[1];
  const id = (namespace === 'people') ? actor.alias : actor.id;

  return (
    <Typography
      {...typographyProps}
      className={classes.root}
    >
      {!linked && actor.name}
      {linked &&
        <Link
          to={`/${namespace}/${id}/`}
          href={`/${namespace}/${id}/`}
          className={classes.link}
        >
          {actor.name}
        </Link>
      }
    </Typography>
  );
};

ActorTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object,
  variant: PropTypes.string,
  linked: PropTypes.bool,
  typographyProps: PropTypes.object,
};

ActorTitle.defaultProps = {
  actor: {
    id: null,
    name: '',
    alias: '',
    namespace: 'com.people.person',
  },
  linked: false,
  variant: 'title',
  typographyProps: {},
};

export default withStyles(styles)(ActorTitle);
