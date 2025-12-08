import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';

import MediumCard from '../Medium';
import ActorAvatar from '../../actor/Avatar';
import CardOwner from '../Owner';
import utils from '../../../utils';
import NodeType from '../../../proptypes/Node';

const {
  getURL,
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
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
    content: {},
  };
});

const FeedCardRepost = ({
  node,
  stats,
  actions,
  menu,
  showOwner,
}) => {
  const classes = useStyles();
  const url = getURL(node.parent);
  const creationTime = moment.utc(node.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(node.creationTime).fromNow();

  return (
    <Card
      className={classes.card}
      component="section"
    >
      {showOwner && node.parent && node.parent.owner && <CardOwner owner={node.parent.owner} />}
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
      <CardContent className={classes.content}>
        <MediumCard
          medium={node.parent}
          cardProps={{ variant: 'outlined' }}
        />
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

FeedCardRepost.propTypes = {
  menu: PropTypes.node,
  stats: PropTypes.node,
  actions: PropTypes.node,
  node: NodeType.isRequired,
  showOwner: PropTypes.bool,
};

FeedCardRepost.defaultProps = {
  showOwner: false,
  menu: null,
  stats: null,
  actions: null,
};

export default FeedCardRepost;
