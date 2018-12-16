import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';
import {
  browseMedia,
  resetMedia,
} from '../../actions/media';
import { Person as PERSON } from '../../constants';
import MediumCard from '../../components/cards/MediumCard';
import ActorAvatar from '../../components/ActorAvatar';
import ActorTitle from '../../components/ActorTitle';

import PersonType from '../../proptypes/Person';
import MediaListType from '../../proptypes/Media';

const styles = (theme) => {
  return {
    root: {
      width: '100%',
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
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
    };

    this.offset = 0;
    this.fetchMedia = this.fetchMedia.bind(this);
  }

  componentWillUnmount() {
    this.props.resetMedia();
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

  hasMore() {
    const { total, media } = this.props;
    return !this.offset || media.allIds.length < total;
  }

  fetchMedia() {
    const { ownerId, filter } = this.state;
    const { namespace } = this.props;

    this.props.browseMedia({
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

    const hasMore = this.hasMore();

    return (
      <div className={classes.root}>
        {this.canAdd() &&
          <Button
            className={classes.addButton}
            variant="fab"
            color="secondary"
            aria-label="add"
            component={Link}
            to={`/${namespace}/add/`}
          >
            <AddIcon />
          </Button>
        }
        <Toolbar>
          <Typography
            variant="display1"
            color="inherit"
            className={classes.title}
          >
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchMedia}
          hasMore={hasMore}
          loader={<CircularProgress key={0} className={classes.progress} />}
        >
          <StackGrid
            columnWidth={this.getColumnWidth()}
            duration={50}
            gutterWidth={16}
            gutterHeight={16}
          >
            {media.allIds.map((mediumId) => {
              const medium = media.byId[mediumId];
              const key = `medium_${medium.id}`;
              const author = medium.author || {
                id: null,
                name: 'unknown',
                givenName: '?',
                familyName: '?',
                objectType: 'com.people.person',
                imageURL: '',
              };

              const portrait = medium.imageURL &&
              medium.imageURL.medium &&
              medium.imageURL.medium.url;

              const cover = medium.coverURL &&
              medium.coverURL.medium &&
              medium.coverURL.medium.url;

              return (
                <MediumCard
                  key={key}
                  author={
                    <ActorTitle
                      actor={author}
                      typographyProps={{
                          component: 'h4',
                          variant: 'title',
                          className: classes.authorName,
                      }}
                      linked={Boolean(author.id)}
                    />
                  }
                  authorAvatar={
                    <ActorAvatar
                      actor={author}
                      linked={Boolean(author.id)}
                    />
                  }
                  owner={
                    <ActorTitle
                      actor={medium.owner}
                      typographyProps={{
                          component: 'h5',
                          variant: 'subheading',
                          className: classes.ownerName,
                      }}
                      linked
                    />
                  }
                  title={medium.name}
                  alias={medium.alias}
                  description={medium.body}
                  portrait={portrait}
                  cover={cover}
                  path={`/${namespace}/${medium.id}/`}
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </div>
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
  } = state.mediaReducer;

  const { viewer } = state.authReducer;

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
      dispatch(browseMedia(params, namespace));
    },
    resetMedia: () => {
      dispatch(resetMedia());
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(MediaPage)));
