import React from 'react';
import PropTypes from 'prop-types';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

import ActorAvatar from '../actor/Avatar';
import NodeType from '../../proptypes/Node';
import utils from '../../utils';

const { getURL } = utils.node;

const CardOwner = (props) => {
  const { owner, actions } = props;

  if (!owner) {
    console.debug('CardOwner: No owner provided', props);
    return null;
  }

  const url = getURL(owner);

  return (
    <>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={owner}
            linked
            size="small"
          />
        }
        title={
          <Link href={url}>
            {owner.name}
          </Link>
        }
        actions={actions}
      />
      <Divider />
    </>
  );
};

CardOwner.propTypes = {
  owner: NodeType,
  actions: PropTypes.node,
};

CardOwner.defaultProps = {
  owner: null,
  actions: null,
};

export default CardOwner;
