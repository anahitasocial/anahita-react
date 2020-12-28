import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import ActorType from '../../proptypes/Actor';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import ReadMore from '../ReadMore';
import contentfilter from '../contentfilter';
import utils from '../../utils';

const {
  getURL,
  getCoverURL,
} = utils.node;

const styles = (theme) => {
  return {
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    actions: {
      padding: 8,
    },
    title: {
      fontSize: 16,
    },
    alias: {
      fontSize: 12,
    },
    media: {
      height: theme.spacing(20),
    },
  };
};

const ActorCard = (props) => {
  const {
    classes,
    actor,
    action,
  } = props;

  const cover = getCoverURL(actor);
  const url = getURL(actor);

  return (
    <Card variant="outlined">
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={actor.name}
            src="picture"
          />
        </Link>
      }
      <CardHeader
        avatar={
          <ActorAvatar
            actor={actor}
            linked
          />
        }
        title={
          <ActorTitle
            actor={actor}
            typographyProps={{
                variant: 'h6',
                className: classes.title,
            }}
            linked
          />
        }
        subheader={
          <Typography
            variant="subtitle1"
            className={classes.alias}
          >
            {`@${actor.alias}`}
          </Typography>
        }
      />
      {actor.body &&
      <CardContent>
        <ReadMore charLimit={160}>
          {contentfilter({
            text: actor.body,
            filters: [
              'hashtag',
              'mention',
              'url',
            ],
          })}
        </ReadMore>
      </CardContent>
      }
      <CardActions className={classes.actions}>
        {action}
      </CardActions>
    </Card>
  );
};

ActorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.node,
  actor: ActorType.isRequired,
};

ActorCard.defaultProps = {
  action: null,
};

export default withStyles(styles)(ActorCard);
