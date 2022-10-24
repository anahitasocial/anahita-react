import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../EntityBody';
import CommentType from '../../proptypes/Comment';
import utils from '../../utils';

const {
  getCommentURL,
  getAuthor,
} = utils.node;

const CommentCard = (props) => {
  const {
    comment,
    stats,
    actions,
    menu,
    isEditing,
    commentForm,
  } = props;

  const author = getAuthor(comment);
  const url = getCommentURL(comment);
  const { creationTime } = comment;

  if (isEditing) {
    return (
      <>
        {commentForm}
      </>
    );
  }

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
        primary={<ActorTitle
          actor={author}
          linked={Boolean(author.id)}
        />}
        secondary={
          <>
            {Boolean(author.id) &&
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >
                <Link
                  href={url}
                  title={moment.utc(creationTime).format('LLL').toString()}
                >
                  {moment.utc(creationTime).fromNow()}
                </Link>
              </Typography>}
            <EntityBody contentFilter>
              {comment.body}
            </EntityBody>
            <div>
              {stats}
            </div>
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
  );
};

CommentCard.propTypes = {
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comment: CommentType.isRequired,
  commentForm: PropTypes.node,
  isEditing: PropTypes.bool,
};

CommentCard.defaultProps = {
  actions: null,
  menu: null,
  commentForm: null,
  isEditing: false,
  stats: null,
};

export default CommentCard;
