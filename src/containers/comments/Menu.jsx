import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import i18n from '../../languages';
import utils from '../../utils';

import ControlFollow from '../controls/Follow';
import ControlBlock from '../controls/Block';
import ControlDelete from '../controls/comment/Delete';

import PersonType from '../../proptypes/Person';
import CommentType from '../../proptypes/Comment';

const { withRef } = utils.component;

const FollowActionWithRef = withRef(ControlFollow);
const BlockActionActionWithRef = withRef(ControlBlock);
const DeleteActionWithRef = withRef(ControlDelete);

const CommentMenu = (props) => {
  const {
    comment,
    viewer,
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
        {author && author.id !== viewer.id && false &&
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
            key={`comment-delete-${comment.id}`}
            inline={inline}
          />}
      </Menu>
    </>
  );
};

CommentMenu.propTypes = {
  comment: CommentType.isRequired,
  viewer: PersonType.isRequired,
  handleEdit: PropTypes.func.isRequired,
  inline: PropTypes.bool,
};

CommentMenu.defaultProps = {
  inline: false,
};

export default CommentMenu;
