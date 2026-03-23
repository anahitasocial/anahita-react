import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';

import ActorAvatar from '../../actor/Avatar';
import ReadMore from '../../ReadMore';
import CardOwner from '../Owner';
import Player from '../../Player';
import utils from '../../../utils';
import NodeType from '../../../proptypes/Node';

const {
  getURL,
  getPortraitURL,
  getCoverURL,
} = utils.node;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    blockquote: {
      marginLeft: theme.spacing(2),
      borderLeft: 4,
      borderColor: theme.palette.background.default,
      borderLeftStyle: 'solid',
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
});

const FeedCardComment = ({
  node,
  actions = null,
  stats = null,
  menu = null,
  showOwner = false,
}) => {
  const classes = useStyles();
  const portrait = getPortraitURL(node.parent, 'medium');
  const cover = getCoverURL(node.parent);
  const {
    name: parentTitle = '',
    body: parentBody = '',
  } = node.parent;
  const { body } = node;
  const url = getURL(node.parent);
  const creationTime = moment.utc(node.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(node.creationTime).fromNow();

  return (
    <Card
      className={classes.card}
      component="article"
    >
      {showOwner && node.parent.owner && <CardOwner owner={node.parent.owner} />}
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={parentTitle}
          />
        </Link>}
      {portrait &&
        <Link href={url}>
          <CardMedia
            component="img"
            title={parentTitle}
            image={portrait}
          />
        </Link>}
      {parentBody && <Player text={parentBody} />}
      <CardContent className={classes.blockquote} component="blockquote">
        {parentBody &&
          <ReadMore contentFilter>
            {parentBody}
          </ReadMore>}
      </CardContent>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={node.author}
            linked={node.author.id > 0}
          />
        }
        title={node.author.name}
        subheader={
          <Link
            href={url}
            title={creationTime}
          >
            {creationTimeFromNow}
          </Link>
        }
        action={menu}
      />
      <CardContent>
        {body &&
          <ReadMore contentFilter>
            {body}
          </ReadMore>}
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

FeedCardComment.propTypes = {
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  node: NodeType.isRequired,
  showOwner: PropTypes.bool,
};

export default FeedCardComment;
