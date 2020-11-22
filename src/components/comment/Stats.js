import React from 'react';
import Button from '@material-ui/core/Button';
import CommentIcon from '@material-ui/icons/Comment';

import NodeType from '../../proptypes/Node';
import utils from '../../utils';

const { getURL } = utils.node;

const CommentStats = (props) => {
  const { node } = props;
  const url = getURL(node);

  return (
    <Button
      component="a"
      href={url}
      startIcon={<CommentIcon />}
      disabled={node.numOfComments === 0}
      size="small"
    >
      {node.numOfComments}
    </Button>
  );
};

CommentStats.propTypes = {
  node: NodeType.isRequired,
};

export default CommentStats;
