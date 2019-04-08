import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

import ActorAvatar from '../actor/Avatar';
import NodeType from '../../proptypes/Node';
import { getURL } from '../utils';

const CardOwner = (props) => {
  const { node: { owner } } = props;
  const url = getURL(owner);
  return (
    <React.Fragment>
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
      />
      <Divider />
    </React.Fragment>
  );
};

CardOwner.propTypes = {
  node: NodeType.isRequired,
};

export default CardOwner;
