import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';

import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../EntityBody';
import CommentType from '../../proptypes/Comment';

import {
  getCommentURL,
  getAuthor,
} from '../utils';

const styles = (theme) => {
  return {
    title: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    content: {
      paddingTop: 0,
    },
  };
};

const CommentCard = (props) => {
  const {
    comment,
    classes,
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
      <React.Fragment>
        {commentForm}
      </React.Fragment>
    );
  }

  return (
    <Card square className={classes.root}>
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
          <Link href={url}>
            <ReactTimeAgo
              date={new Date(creationTime)}
            />
          </Link>
        }
        action={menu}
      />
      <CardContent className={classes.content}>
        <EntityBody size="small">
          {comment.body}
        </EntityBody>
      </CardContent>
      {stats &&
        <CardActions>
          {stats}
        </CardActions>
      }
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default withStyles(styles)(CommentCard);
