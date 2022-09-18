import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import i18n from '../../languages';
import utils from '../../utils';

import FollowAction from '../actions/Follow';
import BlockAction from '../actions/Block';
import DeleteAction from '../actions/comment/Delete';

import PersonType from '../../proptypes/Person';
import NodeType from '../../proptypes/Node';
import CommentType from '../../proptypes/Comment';

const { withRef } = utils.component;

const FollowActionWithRef = withRef(FollowAction);
const BlockActionActionWithRef = withRef(BlockAction);
const DeleteActionWithRef = withRef(DeleteAction);

const CommentMenu = (props) => {
  const {
    comment,
    viewer,
    node,
    handleEdit,
    inline,
  } = props;

  const canEdit = Boolean(comment.authorized.edit);
  const canDelete = Boolean(comment.authorized.delete);
  const { author } = comment;

  const [menuAnchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-owns={menuAnchorEl ? `comment-card-menu-${comment.id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`comment-menu-${comment.id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {canEdit &&
          <MenuItem
            onClick={handleEdit}
            key={`comment-edit-${comment.id}`}
          >
            {i18n.t('actions:edit')}
          </MenuItem>}
        {author && author.id !== viewer.id &&
          <BlockActionActionWithRef
            actor={author}
            component="menuitem"
            key={`comment-block-${comment.id}`}
            followLabel={i18n.t('comments:actions.followAuthor', {
              name: author.name,
            })}
            unfollowLabel={i18n.t('comments:actions.unfollowAuthor', {
              name: author.name,
            })}
          />}
        {author && author.id !== viewer.id &&
          <FollowActionWithRef
            actor={author}
            component="menuitem"
            key={`comment-follow-${comment.id}`}
            followLabel={i18n.t('comments:actions.followAuthor', {
              name: author.name,
            })}
            unfollowLabel={i18n.t('comments:actions.unfollowAuthor', {
              name: author.name,
            })}
          />}
        {canDelete &&
          <DeleteActionWithRef
            comment={comment}
            node={node}
            key={`comment-delete-${comment.id}`}
            inline={inline}
          />}
      </Menu>
    </>
  );
};

CommentMenu.propTypes = {
  node: NodeType.isRequired,
  comment: CommentType.isRequired,
  viewer: PersonType.isRequired,
  handleEdit: PropTypes.func.isRequired,
  inline: PropTypes.bool,
};

CommentMenu.defaultProps = {
  inline: false,
};

export default CommentMenu;
