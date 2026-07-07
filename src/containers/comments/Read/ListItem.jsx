import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import ActorTitle from '../../../components/actor/Title';
import ActorAvatar from '../../../components/actor/Avatar';
import EntityBody from '../../../components/EntityBody';
import CommentType from '../../../proptypes/Comment';

const CommentListItem = ({
  comment,
  actions = null,
  menu = null,
  isEditing = false,
  commentForm = null,
}) => {
  const { author, creationTime } = comment;

  if (isEditing) {
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
            size="small"
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <ActorTitle
              actor={author}
              linked={Boolean(author.id)}
            />
          }
          secondary={commentForm}
        />
        <ListItemSecondaryAction>
          {menu}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
            size="small"
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <ActorTitle
                actor={author}
                linked={Boolean(author.id)}
              />
              {moment(creationTime).fromNow()}
            </>
          }
          secondary={
            <>
              <EntityBody size="small">
                {comment.body}
              </EntityBody>
              <div>
                {actions}
              </div>
            </>
          }
        />
        <ListItemSecondaryAction>
          {menu}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

CommentListItem.propTypes = {
  actions: PropTypes.node,
  menu: PropTypes.node,
  comment: CommentType.isRequired,
  commentForm: PropTypes.node,
  isEditing: PropTypes.bool,
};

export default CommentListItem;
