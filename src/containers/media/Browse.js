import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';

import appActions from '../../actions/app';
import actions from '../../actions/media';
import permissions from '../../permissions/medium';
import i18n from '../../languages';

import MediaCard from './Card';
import PersonType from '../../proptypes/Person';
import MediaListType from '../../proptypes/Media';

import utils from '../utils';

const styles = (theme) => {
  return {
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(),
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 10,
    },
  };
};

const LIMIT = 20;

class MediaBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ownerId: 0,
      filter: '',
      hasMore: true,
      media: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchMedia = this.fetchMedia.bind(this);
  }

  componentWillMount() {
    const { setAppTitle, namespace } = this.props;
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  componentWillReceiveProps(nextProps) {
    const { media, hasMore } = nextProps;
    this.setState({ media, hasMore });
  }

  componentWillUnmount() {
    const { resetMedia } = this.props;
    resetMedia();
  }

  fetchMedia() {
    const { ownerId, filter } = this.state;
    const { namespace, browseMedia } = this.props;

    browseMedia({
      ownerId,
      filter,
      start: this.offset,
      limit: LIMIT,
    }, namespace);

    this.offset += LIMIT;
  }

  render() {
    const {
      classes,
      namespace,
      viewer,
      width,
    } = this.props;

    const { hasMore, media } = this.state;

    const columnWidth = utils.getColumnWidthPercentage(width);

    return (
      <React.Fragment>
        {permissions.canAdd(viewer) &&
          <Fab
            aria-label="Add"
            color="secondary"
            className={classes.addButton}
            component={Link}
            to={`/${namespace}/add/`}
          >
            <AddIcon />
          </Fab>
        }
        <InfiniteScroll
          loadMore={this.fetchMedia}
          hasMore={hasMore}
          useWindow
          loader={
            <Grid
              container
              justify="center"
              alignItems="center"
              key="circular-progress"
            >
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          }
        >
          <StackGrid
            columnWidth={columnWidth}
            duration={50}
            gutterWidth={16}
            gutterHeight={16}
          >
            {media.allIds.map((mediumId) => {
              const medium = media.byId[mediumId];
              const key = `medium_${medium.id}`;
              return (
                <MediaCard
                  key={key}
                  medium={medium}
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

MediaBrowse.propTypes = {
  classes: PropTypes.object.isRequired,
  browseMedia: PropTypes.func.isRequired,
  resetMedia: PropTypes.func.isRequired,
  media: MediaListType.isRequired,
  namespace: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  // queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

MediaBrowse.defaultProps = {
  // queryFilters: {},
};

const mapStateToProps = (state) => {
  const {
    media,
    error,
    hasMore,
  } = state.media;

  const { viewer } = state.auth;

  return {
    media,
    error,
    hasMore,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseMedia: (params, namespace) => {
      dispatch(actions.browse(params, namespace));
    },
    resetMedia: () => {
      dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(MediaBrowse)));
