import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ActorType from '../../proptypes/Actor';
import utils from '../../utils';

const { getURL } = utils.node;

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
        <Typography
          noWrap
          {...typographyProps}
        >
          <Link href={url}>
            {actor.name}
          </Link>
        </Typography>
      }
      {!linked &&
        <Typography
          noWrap
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
