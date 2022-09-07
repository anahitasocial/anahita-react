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
  const { node: { owner }, actions } = props;
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
  node: NodeType.isRequired,
  actions: PropTypes.node,
};

CardOwner.defaultProps = {
  actions: null,
};

export default CardOwner;
