import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import MediumType from '../../../proptypes/Medium';
import ActorTitle from '../../actor/Title';
import ActorAvatar from '../../actor/Avatar';
import CardHeaderOwner from '../../cards/Owner';
import Player from '../../Player';
import Progress from '../../Progress';
import EntityBody from '../../EntityBody';
import utils from '../../../utils';

const {
  getAuthor,
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
      fontSize: 36,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

const TABS = {
  COMMENTS: 'comments',
  LOCATIONS: 'locations',
};

const MediumReadDefault = (props) => {
  const {
    classes,
    medium,
    privacy,
    actions,
    menu,
    locations,
    comments,
    editing,
    form,
    stats,
  } = props;

  const [tab, setTab] = useState(TABS.COMMENTS);

  const changeTab = (event, value) => {
    setTab(value);
  };

  const portrait = getPortraitURL(medium, 'large');
  const cover = getCoverURL(medium);
  const author = getAuthor(medium);
  const creationTime = moment.utc(medium.creationTime).local().format('LLL').toString();

  const [isLoaded, setIsLoaded] = useState(!portrait);

  useEffect(() => {
    if (portrait) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      image.src = portrait;

      image.onload = () => {
        setIsLoaded(true);
      };
    }
  }, [portrait]);

  return (
    <Grid
      container
      justifyContent="center"
    >
      <Grid item xs={12} md={8}>
        <Card component="article">
          {medium.owner.objectType.split('.')[1] !== 'people' &&
            <CardHeaderOwner node={medium} />}
          {cover &&
            <CardMedia
              className={classes.cover}
              title={medium.name}
              image={cover}
              src="picture"
            />}
          {portrait && isLoaded &&
            <CardMedia
              component="img"
              title={medium.name}
              alias={medium.name}
              image={portrait}
            />}
          {!isLoaded &&
            <CardContent>
              <Progress />
            </CardContent>}
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
                {creationTime}
                {privacy}
              </>
            }
            action={menu}
          />
          {editing && form}
          {!editing &&
            <>
              {medium.body && <Player text={medium.body} />}
              <CardContent component="article">
                {medium.name &&
                  <Typography
                    variant="h2"
                    className={classes.title}
                  >
                    {medium.name}
                  </Typography>}
                {medium.body &&
                  <EntityBody contentFilter>
                    {medium.body}
                  </EntityBody>}
              </CardContent>
              {stats &&
                <CardActions>
                  {stats}
                </CardActions>}
              {actions &&
                <CardActions>
                  {actions}
                </CardActions>}
            </>}
        </Card>
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Comments" value={TABS.COMMENTS} />
          <Tab label="Locations" value={TABS.LOCATIONS} />
        </Tabs>
        {tab === TABS.COMMENTS && comments}
        {tab === TABS.LOCATIONS && locations}
      </Grid>
    </Grid>
  );
};

MediumReadDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  privacy: PropTypes.node,
  locations: PropTypes.node,
  comments: PropTypes.node,
  form: PropTypes.node,
  stats: PropTypes.node,
  editing: PropTypes.bool,
};

MediumReadDefault.defaultProps = {
  actions: null,
  privacy: null,
  menu: null,
  locations: null,
  comments: null,
  form: null,
  editing: false,
  stats: null,
};

export default withStyles(styles)(MediumReadDefault);
