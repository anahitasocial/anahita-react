import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';
import actions from '../../actions/media';
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

class MediaPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ownerId: 0,
      filter: '',
      hasMore: true,
    };

    this.offset = 0;
    this.fetchMedia = this.fetchMedia.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { media, total } = nextProps;
    this.setState({
      hasMore: media.allIds.length < total,
    });
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
    const {
      classes,
      media,
      namespace,
    } = this.props;

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
        <Toolbar>
          <Typography
            variant="h2"
            color="inherit"
            className={classes.title}
          >
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchMedia}
          hasMore={this.state.hasMore}
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

MediaPage.propTypes = {
  classes: PropTypes.object.isRequired,
  browseMedia: PropTypes.func.isRequired,
  resetMedia: PropTypes.func.isRequired,
  media: MediaListType.isRequired,
  namespace: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
};

MediaPage.defaultProps = {
  queryFilters: {},
};

const mapStateToProps = (state) => {
  const {
    media,
    error,
    total,
  } = state.media;

  const { viewer } = state.auth;

  return {
    media,
    error,
    total,
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
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(MediaPage)));
