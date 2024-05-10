import utils from '../utils';

const canAdd = (node) => {
  return utils.node.isCommentable(node) && utils.node.isCommentable(node);
};

export default {
  canAdd,
};
