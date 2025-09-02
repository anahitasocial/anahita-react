import React from 'react';
import PropTypes from 'prop-types';

import FeedCardDefault from './feed/Default';
import FeedCardComment from './feed/Comment';

import NodeType from '../../proptypes/Node';
import utils from '../../utils';

const StoryCard = (props) => {
  const {
    node,
    stats,
    actions,
    menu,
    showOwner,
  } = props;

  const isComment = utils.node.isComment(node);

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

StoryCard.defaultProps = {
  showOwner: false,
  actions: null,
  stats: null,
  menu: null,
};

export default StoryCard;
