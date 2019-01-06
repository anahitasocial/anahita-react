import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';

const styles = (theme) => {
  return {
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
  };
};

const ActorTitle = (props) => {
  const {
    classes,
    actor,
    linked,
    typographyProps,
  } = props;

  const namespace = actor.objectType.split('.')[1];
  const id = (namespace === 'people') ? actor.alias : actor.id;

  return (
    <React.Fragment>
      {linked &&
        <ButtonBase
          component={Link}
          to={`/${namespace}/${id}/`}
          href={`/${namespace}/${id}/`}
          className={classes.link}
        >
          <Typography
            {...typographyProps}
          >
            {actor.name}
          </Typography>
        </ButtonBase>
      }
      {!linked &&
        <Typography
          {...typographyProps}
        >
          {actor.name}
        </Typography>
      }
    </React.Fragment>
  );
};

ActorTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object,
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
  typographyProps: {},
};

export default withStyles(styles)(ActorTitle);
