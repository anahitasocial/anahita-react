import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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
    mediaCard: {
      margin: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
});

const FeedCardRepost = ({
  node,
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
      {showOwner && <CardOwner node={node.parent} />}
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
      <Box className={classes.mediaCard}>
        <MediumCard medium={node.parent} />
      </Box>
    </Card>
  );
};

FeedCardRepost.propTypes = {
  menu: PropTypes.node,
  node: NodeType.isRequired,
  showOwner: PropTypes.bool,
};

FeedCardRepost.defaultProps = {
  showOwner: false,
  menu: null,
};

export default FeedCardRepost;
