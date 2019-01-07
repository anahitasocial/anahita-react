import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import ActorType from '../proptypes/Actor';

const ActorTitle = (props) => {
  const {
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
  actor: ActorType.isRequired,
  linked: PropTypes.bool,
  typographyProps: PropTypes.object,
};

ActorTitle.defaultProps = {
  linked: false,
  typographyProps: {},
};

export default ActorTitle;
