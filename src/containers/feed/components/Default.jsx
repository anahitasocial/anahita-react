import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import ReadMore from '../../../components/ReadMore';
import ActorAvatar from '../../../components/actor/Avatar';
import NodeType from '../../../proptypes/Node';
import CardOwner from '../../../components/medium/OwnerCard';
import Player from '../../../components/Player';
import utils from '../../../utils';

const {
  getURL,
  getPortraitURL,
  getCoverURL,
  getPersonName,
} = utils.node;

const styles = (theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    media: {
      height: 0,
      paddingTop: '100%',
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
};

const FeedCardDefault = ({
  classes,
  node,
  stats = null,
  actions = null,
  menu,
  showOwner = false,
}) => {
  const authorName = getPersonName(node.author);
  const portrait = getPortraitURL(node, 'medium');
  const cover = getCoverURL(node, 'medium');
  const { title, body } = node;
  const url = getURL(node);
  const creationTime = moment.utc(node.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(node.creationTime).fromNow();

  return (
    <Card
      className={classes.root}
      component="article"
    >
      {showOwner && node.owner && <CardOwner owner={node.owner} />}
      <CardHeader
        avatar={
          <ActorAvatar
            actor={node.author}
            linked={node.author.id > 0}
          />
        }
        title={node.author.id > 0 ? (
          <Link href={getURL(node.author)}>
            {authorName}
          </Link>
        ) : authorName}
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
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={title}
            src="picture"
          />
        </Link>}
      {portrait &&
        <Link href={url}>
          <CardMedia
            component="img"
            title={title}
            image={portrait}
          />
        </Link>}
      {body && <Player text={body} />}
      <CardContent>
        {title &&
          <Typography
            variant="h6"
            className={classes.title}
          >
            <Link href={url}>
              {title}
            </Link>
          </Typography>}
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

FeedCardDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  node: NodeType.isRequired,
  showOwner: PropTypes.bool,
};

export default withStyles(styles)(FeedCardDefault);
