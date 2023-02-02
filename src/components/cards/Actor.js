import React from 'react';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Truncate from 'react-truncate';

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import ReadMore from '../ReadMore';
import utils from '../../utils';
import i18n from '../../languages';

const {
  getURL,
  getCoverURL,
  isAdmin,
  isPerson,
} = utils.node;

const styles = (theme) => {
  return {
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
    disabled: {
      borderColor: theme.palette.warning.light,
    },
  };
};

const ActorCard = (props) => {
  const {
    classes,
    actor,
    viewer,
    action,
  } = props;

  const cover = getCoverURL(actor);
  const url = getURL(actor);
  const slug = `@${slugify(actor.alias.toLowerCase())}`;
  const creationTime = moment.utc(actor.creationTime).local().format('LLL').toString();
  const lastVisitDate = isPerson(actor) ? moment.utc(actor.lastVisitDate).local().format('LLL').toString() : null;

  return (
    <Card
      component="section"
      className={!actor.enabled ? classes.disabled : ''}
    >
      {cover &&
        <Link href={url}>
          <CardMedia
            component="img"
            title={actor.name}
            alias={actor.name}
            image={cover}
          />
        </Link>}
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
            <Truncate width={300}>
              {slug}
            </Truncate>
          </Typography>
        }
      />
      {actor.body &&
      <CardContent>
        <ReadMore charLimit={160} contentFilter>
          {actor.body}
        </ReadMore>
      </CardContent>}
      {isAdmin(viewer) &&
        <CardContent>
          <div>
            <Typography variant="caption">
              {i18n.t('people:person.joinedDate', {
                date: creationTime,
              })}
            </Typography>
          </div>
          <div>
            {lastVisitDate &&
            <Typography variant="caption">
              {i18n.t('people:person.lastVisitOn', {
                date: lastVisitDate,
              })}
            </Typography>}
          </div>
        </CardContent>}
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
  viewer: PersonType.isRequired,
};

ActorCard.defaultProps = {
  action: null,
};

export default withStyles(styles)(ActorCard);
