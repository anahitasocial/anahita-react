import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';

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

  const { creationTime } = comment;
  const author = getAuthor(comment);
  const url = getCommentURL(comment);

  if (isEditing) {
    return (
      <>
        {commentForm}
      </>
    );
  }

  return (
    <Card component="section">
      <CardHeader
        avatar={
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
            size="small"
          />
        }
        title={
          <ActorTitle
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        subheader={
          <Link
            href={url}
            title={moment.utc(creationTime).format('LLL').toString()}
          >
            {moment.utc(creationTime).fromNow()}
          </Link>
        }
        action={menu}
      />
      <CardContent>
        <EntityBody contentFilter>
          {comment.body}
        </EntityBody>
      </CardContent>
      {stats &&
        <CardActions>
          {stats}
        </CardActions>}
      {actions &&
        <CardActions>
          {actions}
        </CardActions>}
    </Card>
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
