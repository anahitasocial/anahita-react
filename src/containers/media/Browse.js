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
import i18n from '../../languages';

import LikeAction from '../actions/Like';
import { Person as PERSON } from '../../constants';
import MediumCard from '../../components/cards/Medium';
import PersonType from '../../proptypes/Person';
import MediaListType from '../../proptypes/Media';

const styles = (theme) => {
  return {
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 3,
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

  getColumnWidth() {
    let columnWidth = '100%';

    switch (this.props.width) {
      case 'md': {
        columnWidth = '50%';
        break;
      }
      case 'lg': {
        columnWidth = '33.33%';
        break;
      }
      case 'xl': {
        columnWidth = '25%';
        break;
      }
      case 'xs':
      case 'sm':
      default: {
        break;
      }
    }

    return columnWidth;
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

  canAdd() {
    const { viewer } = this.props;

    if ([
      PERSON.TYPE.SUPER_ADMIN,
      PERSON.TYPE.ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    return false;
  }

  render() {
    const { classes, namespace } = this.props;
    const { hasMore, media } = this.state;

    const columnWidth = this.getColumnWidth();

    return (
      <React.Fragment>
        {this.canAdd() &&
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
              key="actors-progress"
            >
              <Grid item>
                <CircularProgress className={classes.progress} />
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
                <MediumCard
                  key={key}
                  medium={medium}
                  actions={
                    <React.Fragment>
                      <LikeAction
                        medium={medium}
                        isLiked={medium.commands.includes('unvote')}
                      />
                    </React.Fragment>
                  }
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
