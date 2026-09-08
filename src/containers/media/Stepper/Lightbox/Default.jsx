import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import ZoomOutIcon from '@material-ui/icons/FullscreenExit';

import MediumType from '../../../../proptypes/Medium';
import ActorTitle from '../../../../components/ActorTitle';
import ActorAvatar from '../../../../components/ActorAvatar';
import CardHeaderOwner from '../../../../components/MediumOwnerCardHeader';
import Player from '../../../../components/Player';
import EntityBody from '../../../../components/NodeBody';
import i18n from '../../../../languages';
import utils from '../../../../utils';
import styles from './styles';

const {
  getAuthor,
  getNamespace,
  getURL,
  getPortraitURL,
  getPortraitURLs,
} = utils.node;

const SWIPE_THRESHOLD = 50;
// Below this a mouse gesture is a click that toggles zoom; above it, a pan.
const DRAG_THRESHOLD = 5;

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
  const [resolvedSrc, setResolvedSrc] = useState('');
  const [loadedSrc, setLoadedSrc] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomLoading, setIsZoomLoading] = useState(false);
  const [hasZoomFailed, setHasZoomFailed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const touchStartRef = useRef(null);
  const paneRef = useRef(null);
  const dragRef = useRef(null);
  const zoomLoaderRef = useRef(null);

  // A size the API lists is not necessarily a size it stored, so these are
  // candidates rather than a URL.
  const portraits = useMemo(() => {
    return getPortraitURLs(medium, 'large');
  }, [medium]);

  // Probing candidates by pointing the visible <img> at them blanks the pane
  // once per 404, so a photo whose 'large' was never generated flickers twice
  // before it appears. Resolve out of band instead and hand the element only a
  // URL that has already loaded — it then paints from cache, in one step.
  useEffect(() => {
    let isCurrent = true;
    setResolvedSrc('');

    const attempt = (index) => {
      const candidate = portraits[index];
      if (!isCurrent || !candidate) return;

      const probe = new window.Image();
      probe.onload = () => {
        if (isCurrent) setResolvedSrc(candidate);
      };
      probe.onerror = () => {
        attempt(index + 1);
      };
      probe.src = candidate;
    };

    attempt(0);

    return () => {
      isCurrent = false;
    };
  }, [portraits]);

  // The full upload runs to several megabytes, so it is fetched only once
  // someone asks to zoom — never on open, and never by the neighbour prefetch.
  const zoom = getPortraitURL(medium, 'original');
  const hasPortrait = portraits.length > 0;
  const src = isZoomed ? zoom : resolvedSrc;
  // Derived rather than reset in an effect: an effect lands a frame late, and
  // that frame shows the previous photo under the new src.
  const isPortraitLoaded = Boolean(src) && loadedSrc === src;
  const canZoom = hasPortrait && Boolean(zoom) && !hasZoomFailed;
  const url = getURL(medium);
  const author = getAuthor(medium);
  const creationTime = moment.utc(medium.creationTime).local().format('LLL').toString();

  // Drop a download still in flight: its photo is no longer the one on screen.
  const cancelZoomLoad = useCallback(() => {
    if (zoomLoaderRef.current) {
      zoomLoaderRef.current.onload = null;
      zoomLoaderRef.current.onerror = null;
      zoomLoaderRef.current = null;
    }
    setIsZoomLoading(false);
  }, []);

  useEffect(() => {
    setIsZoomed(false);
    setHasZoomFailed(false);
    cancelZoomLoad();
  }, [medium.id, cancelZoomLoad]);

  useEffect(() => {
    return cancelZoomLoad;
  }, [cancelZoomLoad]);

  // The original runs to several megabytes, so fetch it out of band and keep
  // the fitted image on screen until it has arrived — swapping src first would
  // blank the pane for the length of the download.
  const handleZoomToggle = useCallback(() => {
    if (isZoomed) {
      // The fitted size is still cached from before the zoom, so mark it
      // loaded as we go back to it rather than fading in from a spinner.
      setLoadedSrc(resolvedSrc);
      setIsZoomed(false);
      return;
    }
    if (!canZoom || isZoomLoading) return;

    const loader = new window.Image();
    zoomLoaderRef.current = loader;
    setIsZoomLoading(true);

    loader.onload = () => {
      if (zoomLoaderRef.current !== loader) return;
      zoomLoaderRef.current = null;
      setIsZoomLoading(false);
      // Marked loaded before it is shown: it is in cache, so the swap must not
      // fade out through a blank frame on the way in.
      setLoadedSrc(zoom);
      setIsZoomed(true);
    };

    loader.onerror = () => {
      if (zoomLoaderRef.current !== loader) return;
      zoomLoaderRef.current = null;
      setIsZoomLoading(false);
      setHasZoomFailed(true);
    };

    loader.src = zoom;
  }, [canZoom, isZoomed, isZoomLoading, zoom, resolvedSrc]);

  // Panning is mouse-only: a zoomed pane scrolls, so touch already pans itself.
  const handleMouseDown = (event) => {
    if (!isZoomed || !paneRef.current) return;
    event.preventDefault();
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: paneRef.current.scrollLeft,
      scrollTop: paneRef.current.scrollTop,
      moved: false,
    };
    setIsPanning(true);
  };

  const handleMouseMove = (event) => {
    const drag = dragRef.current;
    if (!drag || !paneRef.current) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      drag.moved = true;
    }

    paneRef.current.scrollLeft = drag.scrollLeft - dx;
    paneRef.current.scrollTop = drag.scrollTop - dy;
  };

  const handleMouseUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    setIsPanning(false);
    // A press that went nowhere was a click, so it zooms back out.
    if (drag && !drag.moved) handleZoomToggle();
  };

  const changeTab = (event, value) => {
    setTab(value);
  };

  const handleTouchStart = (event) => {
    if (isZoomed) return;
    touchStartRef.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    // While zoomed a horizontal drag is panning the photo, not stepping off it.
    if (isZoomed || start === null) return;

    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance < 0 && hasNext) handleNext();
    if (distance > 0 && hasPrev) handlePrev();
  };

  const prevLabel = i18n.t('media:stepper.previous');
  const nextLabel = i18n.t('media:stepper.next');
  const zoomLabel = i18n.t(isZoomed ? 'media:stepper.zoomOut' : 'media:stepper.zoomIn');

  const image = src ? (
    <img
      className={clsx(
        classes.portrait,
        isPortraitLoaded && classes.portraitLoaded,
        isZoomed && classes.portraitZoomed,
      )}
      alt={medium.name}
      src={src}
      draggable={false}
      onLoad={() => {
        setLoadedSrc(src);
        // Open the zoom on the middle of the photo rather than its top-left
        // corner.
        const pane = paneRef.current;
        if (isZoomed && pane) {
          pane.scrollLeft = (pane.scrollWidth - pane.clientWidth) / 2;
          pane.scrollTop = (pane.scrollHeight - pane.clientHeight) / 2;
        }
      }}
      onError={() => {
        // Everything shown here was fetched successfully moments ago, so this
        // only fires if the cache dropped it. Fall back to the fitted view;
        // the resolver picks a size again on the next photo.
        if (isZoomed) setIsZoomed(false);
      }}
    />
  ) : null;

  return (
    <div className={classes.root}>
      <Grid container>
        {hasPortrait &&
          <Grid
            item
            xs={12}
            md={8}
            ref={paneRef}
            className={clsx(
              classes.mediaPane,
              isZoomed && classes.mediaPaneZoomed,
              isPanning && classes.mediaPanePanning,
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {(!isPortraitLoaded || isZoomLoading) &&
              <CircularProgress className={classes.spinner} />}
            {/* Zoomed, the pane itself takes the click so a pan does not
                register as one; fitted, a real button carries the affordance
                and gives the keyboard a way in. */}
            {isZoomed && image}
            {!isZoomed && canZoom && image &&
              <button
                type="button"
                className={classes.zoomButton}
                title={zoomLabel}
                aria-label={zoomLabel}
                onClick={handleZoomToggle}
              >
                {image}
              </button>}
            {!isZoomed && !canZoom && image}
            {isZoomed &&
              <div className={classes.zoomExit}>
                <Tooltip title={zoomLabel}>
                  <IconButton
                    className={classes.overlayNavButton}
                    aria-label={zoomLabel}
                    onClick={handleZoomToggle}
                  >
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
              </div>}
            {!isZoomed &&
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
            </div>}
            {!isZoomed &&
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
            </div>}
          </Grid>}
        <Grid
          item
          xs={12}
          md={hasPortrait ? 4 : 12}
        >
          <div className={classes.details}>
            <div className={hasPortrait ? undefined : classes.detailsInner}>
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
              {!hasPortrait && (hasPrev || hasNext) &&
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
