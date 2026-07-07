import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { useNavigate } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import MediumType from '../proptypes/Medium';
import ActorTitle from './ActorTitle';
import ActorAvatar from './ActorAvatar';
import CardHeaderOwner from './MediumOwner';
import Player from './Player';
import Progress from './Progress';
import ReadMore from './ReadMore';
import utils from '../utils';

const {
  getAuthor,
  getURL,
  getPortraitURL,
  getCoverURL,
} = utils.node;

const styles = (theme) => {
  return {
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    content: {},
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

const MediumCard = ({
  classes,
  medium,
  stats = null,
  actions = null,
  access = null,
  ownerActions = null,
  menu = null,
  handleView = null,
  cardProps = {
    variant: 'elevation',
    elevation: 0,
    component: 'section',
  },
}) => {
  const navigate = useNavigate();
  const portrait = getPortraitURL(medium);
  const cover = getCoverURL(medium);
  const url = getURL(medium);
  const author = getAuthor(medium);
  const creationTime = moment.utc(medium.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(medium.creationTime).fromNow();

  const [isPortraitLoaded, setIsPortraitLoaded] = useState(!portrait);

  useEffect(() => {
    if (portrait) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      image.src = portrait;

      image.onload = () => {
        setIsPortraitLoaded(true);
      };
    }
  }, [portrait]);

  return (
    <Card {...cardProps}>
      {medium.author && medium.owner.id !== medium.author.id &&
        <CardHeaderOwner
          owner={medium.owner}
          actions={ownerActions}
        />}
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={medium.name}
            src="picture"
          />
        </Link>}
      <CardHeader
        avatar={
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        title={
          <ActorTitle
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        subheader={
          <>
            <Link
              href={url}
              title={creationTime}
            >
              {creationTimeFromNow}
            </Link>
            {access}
          </>
        }
        action={menu}
      />
      {portrait && isPortraitLoaded &&
        <ButtonBase
          style={{
            width: '100%',
            display: 'inline',
          }}
          onClick={() => {
            if (handleView) {
              return handleView(medium.id);
            }
            return navigate(url);
          }}
        >
          <CardMedia
            component="img"
            title={medium.name}
            alias={medium.name}
            image={portrait}
          />
        </ButtonBase>}
      {!isPortraitLoaded &&
        <CardContent>
          <Progress />
        </CardContent>}
      {medium.body && <Player text={medium.body} />}
      <CardContent component="article" className={classes.content}>
        {medium.name &&
          <Typography
            variant="h2"
            className={classes.title}
          >
            <Link href={url}>
              {medium.name}
            </Link>
          </Typography>}
        {medium.body &&
          <ReadMore contentFilter>
            {medium.body}
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

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stats: PropTypes.node,
  actions: PropTypes.node,
  access: PropTypes.node,
  ownerActions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  handleView: PropTypes.func,
  cardProps: PropTypes.objectOf(PropTypes.any),
};

export default withStyles(styles)(MediumCard);
