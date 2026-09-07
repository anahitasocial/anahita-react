import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';

import MediumType from '../../../../proptypes/Medium';
import ActorTitle from '../../../../components/ActorTitle';
import ActorAvatar from '../../../../components/ActorAvatar';
import CardHeaderOwner from '../../../../components/MediumOwnerCardHeader';
import Player from '../../../../components/Player';
import EntityBody from '../../../../components/NodeBody';
import i18n from '../../../../languages';
import utils from '../../../../utils';

const {
  getAuthor,
  getNamespace,
  getURL,
  getPortraitURL,
} = utils.node;

// The dense toolbar the stepper puts above us, plus its divider.
const HEADER_HEIGHT = 49;
const PANE_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;
const SWIPE_THRESHOLD = 50;

const styles = (theme) => {
  return {
    root: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      [theme.breakpoints.up('md')]: {
        overflow: 'hidden',
      },
    },
    mediaPane: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      userSelect: 'none',
      backgroundColor: '#000',
      height: PANE_HEIGHT,
      [theme.breakpoints.down('sm')]: {
        height: '60vh',
        minHeight: 240,
      },
    },
    portrait: {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.short,
      }),
    },
    portraitLoaded: {
      opacity: 1,
    },
    spinner: {
      position: 'absolute',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    overlayNav: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    overlayNavButton: {
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.25)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
    overlayNavPrev: {
      left: theme.spacing(1),
    },
    overlayNavNext: {
      right: theme.spacing(1),
    },
    details: {
      height: PANE_HEIGHT,
      overflowY: 'auto',
      [theme.breakpoints.down('sm')]: {
        height: 'auto',
        overflowY: 'visible',
      },
    },
    detailsInner: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 720,
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    tabs: {
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    footerNav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2),
    },
  };
};

const TABS = {
  COMMENTS: 'comments',
  LOCATIONS: 'locations',
};

const MediumStepperLightboxDefault = ({
  classes,
  medium,
  actions,
  menu,
  stats,
  locations,
  comments,
  editing,
  form,
  hasNext,
  hasPrev,
  handleNext,
  handlePrev,
}) => {
  const [tab, setTab] = useState(TABS.COMMENTS);
  const [isPortraitLoaded, setIsPortraitLoaded] = useState(false);
  const touchStartRef = useRef(null);

  const portrait = getPortraitURL(medium, 'large');
  const url = getURL(medium);
  const author = getAuthor(medium);
  const creationTime = moment.utc(medium.creationTime).local().format('LLL').toString();

  useEffect(() => {
    setIsPortraitLoaded(false);
  }, [portrait]);

  const changeTab = (event, value) => {
    setTab(value);
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (start === null) return;

    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance < 0 && hasNext) handleNext();
    if (distance > 0 && hasPrev) handlePrev();
  };

  const prevLabel = i18n.t('media:stepper.previous');
  const nextLabel = i18n.t('media:stepper.next');

  return (
    <div className={classes.root}>
      <Grid container>
        {portrait &&
          <Grid
            item
            xs={12}
            md={8}
            className={classes.mediaPane}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {!isPortraitLoaded && <CircularProgress className={classes.spinner} />}
            <img
              className={clsx(classes.portrait, isPortraitLoaded && classes.portraitLoaded)}
              alt={medium.name}
              src={portrait}
              onLoad={() => {
                return setIsPortraitLoaded(true);
              }}
              onError={() => {
                return setIsPortraitLoaded(true);
              }}
            />
            <div className={clsx(classes.overlayNav, classes.overlayNavPrev)}>
              <Tooltip title={prevLabel}>
                <span>
                  <IconButton
                    className={classes.overlayNavButton}
                    aria-label={prevLabel}
                    onClick={handlePrev}
                    disabled={!hasPrev}
                  >
                    <PrevIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
            <div className={clsx(classes.overlayNav, classes.overlayNavNext)}>
              <Tooltip title={nextLabel}>
                <span>
                  <IconButton
                    className={classes.overlayNavButton}
                    aria-label={nextLabel}
                    onClick={handleNext}
                    disabled={!hasNext}
                  >
                    <NextIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </Grid>}
        <Grid
          item
          xs={12}
          md={portrait ? 4 : 12}
        >
          <div className={classes.details}>
            <div className={portrait ? undefined : classes.detailsInner}>
              <Card variant="outlined" square>
                {medium.owner && medium.owner.type &&
                  getNamespace(medium.owner) !== 'people' &&
                  <CardHeaderOwner owner={medium.owner} />}
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
                    <Link
                      href={url}
                      title={creationTime}
                    >
                      {moment.utc(medium.creationTime).fromNow()}
                    </Link>
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
                        <EntityBody>
                          {utils.contentfilter({
                            text: medium.body,
                            filters: [
                              'hashtag',
                              'mention',
                              'url',
                            ],
                          })}
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
              {!portrait && (hasPrev || hasNext) &&
                <Box className={classes.footerNav}>
                  <IconButton
                    aria-label={prevLabel}
                    onClick={handlePrev}
                    disabled={!hasPrev}
                  >
                    <PrevIcon />
                  </IconButton>
                  <IconButton
                    aria-label={nextLabel}
                    onClick={handleNext}
                    disabled={!hasNext}
                  >
                    <NextIcon />
                  </IconButton>
                </Box>}
              <Tabs
                className={classes.tabs}
                value={tab}
                onChange={changeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label={i18n.t('comments:cTitle')} value={TABS.COMMENTS} />
                <Tab label={i18n.t('locations:cTitle')} value={TABS.LOCATIONS} />
              </Tabs>
              {tab === TABS.COMMENTS && comments}
              {tab === TABS.LOCATIONS && locations}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

MediumStepperLightboxDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  stats: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
  form: PropTypes.node,
  editing: PropTypes.bool,
  hasNext: PropTypes.bool.isRequired,
  hasPrev: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default withStyles(styles)(MediumStepperLightboxDefault);
