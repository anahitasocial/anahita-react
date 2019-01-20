import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import ActorType from '../proptypes/Actor';

import { getURL } from './utils';

const ActorTitle = (props) => {
  const {
    actor,
    linked,
    typographyProps,
  } = props;

  const url = getURL(actor);

  return (
    <React.Fragment>
      {linked &&
        <ButtonBase
          component={Link}
          to={url}
          href={url}
        >
          <Typography
            noWrap
            gutterBottom
            {...typographyProps}
          >
            {actor.name}
          </Typography>
        </ButtonBase>
      }
      {!linked &&
        <Typography
          noWrap
          gutterBottom
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
