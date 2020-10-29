import React from 'react';
import Button from '@material-ui/core/Button';
import CommentIcon from '@material-ui/icons/Comment';

import NodeType from '../../proptypes/Node';

import { getURL } from '../utils';

const CommentStats = (props) => {
  const { node } = props;
  const url = getURL(node);

  return (
    <Button
      component="a"
      href={url}
      fullWidth
      endIcon={<CommentIcon />}
      disabled={node.numOfComments === 0}
    >
      {node.numOfComments}
    </Button>
  );
};

CommentStats.propTypes = {
  node: NodeType.isRequired,
};

export default CommentStats;
