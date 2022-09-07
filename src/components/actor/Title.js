import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Truncate from 'react-truncate';
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
    <>
      {linked &&
        <Typography
          {...typographyProps}
        >
          <Link href={url}>
            <Truncate width={300}>
              {actor.name}
            </Truncate>
          </Link>
        </Typography>}
      {!linked &&
        <Typography
          {...typographyProps}
        >
          <Truncate>
            {actor.name}
          </Truncate>
        </Typography>}
    </>
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
