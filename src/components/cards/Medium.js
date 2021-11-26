import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import CardHeaderOwner from './Owner';
import Player from '../Player';
import ReadMore from '../ReadMore';
import utils from '../../utils';

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

const MediumCard = (props) => {
  const {
    classes,
    medium,
    stats,
    actions,
    privacy,
    ownerActions,
    menu,
    handleView,
    history,
  } = props;

  const portrait = getPortraitURL(medium);
  const cover = getCoverURL(medium);
  const url = getURL(medium);
  const author = getAuthor(medium);

  return (
    <Card
      component="article"
      variant="outlined"
    >
      {medium.author && medium.owner.id !== medium.author.id &&
        <CardHeaderOwner
          node={medium}
          actions={ownerActions}
        />
      }
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={medium.name}
            src="picture"
          />
        </Link>
      }
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
          <React.Fragment>
            <Link
              href={url}
              title={moment.utc(medium.creationTime).format('LLL').toString()}
            >
              {moment.utc(medium.creationTime).fromNow()}
            </Link> {privacy}
          </React.Fragment>
        }
        action={menu}
      />
      {portrait &&
        <ButtonBase
          style={{
            width: '100%',
            display: 'inline',
          }}
          onClick={(e) => {
            if (handleView) {
              return handleView(e, medium);
            }

            return history.push(url);
          }}
        >
          <CardMedia
            component="img"
            title={medium.name}
            alias={medium.name}
            image={portrait}
          />
        </ButtonBase>
      }
      {medium.body &&
        <Player text={medium.body} />
      }
      <CardContent component="article" className={classes.content}>
        {medium.name &&
          <Typography
            variant="h2"
            className={classes.title}
          >
            <Link href={url}>
              {medium.name}
            </Link>
          </Typography>
        }
        {medium.body &&
          <ReadMore contentFilter>
            {medium.body}
          </ReadMore>
        }
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

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stats: PropTypes.node,
  actions: PropTypes.node,
  privacy: PropTypes.node,
  ownerActions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  handleView: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

MediumCard.defaultProps = {
  actions: null,
  privacy: null,
  ownerActions: null,
  menu: null,
  stats: null,
  handleView: null,
};

export default withRouter(withStyles(styles)(MediumCard));
