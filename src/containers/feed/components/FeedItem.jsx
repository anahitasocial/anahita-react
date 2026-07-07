import React from 'react';
import PropTypes from 'prop-types';

import FeedCardDefault from './Default';
import FeedCardComment from './Comment';
import FeedCardRepost from './Repost';
import NodeType from '../../../proptypes/Node';
import utils from '../../../utils';

const StoryCard = ({
  node,
  stats = null,
  actions = null,
  menu = null,
  showOwner = false,
}) => {
  const isComment = utils.node.isComment(node);
  const isRepost = utils.node.isRepost(node);

  if (isComment) {
    return (
      <FeedCardComment
        node={node}
        stats={stats}
        actions={actions}
        menu={menu}
        showOwner={showOwner}
      />
    );
  }

  if (isRepost) {
    return (
      <FeedCardRepost
        node={node}
        stats={stats}
        actions={actions}
        menu={menu}
        showOwner={showOwner}
      />
    );
  }

  return (
    <FeedCardDefault
      node={node}
      stats={stats}
      actions={actions}
      menu={menu}
      showOwner={showOwner}
    />
  );
};

StoryCard.propTypes = {
  actions: PropTypes.node,
  stats: PropTypes.node,
  menu: PropTypes.node,
  node: NodeType.isRequired,
  showOwner: PropTypes.bool,
};

export default StoryCard;
