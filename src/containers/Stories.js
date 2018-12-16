import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import {
  browseStories,
  resetStories,
} from '../actions/stories';
import StoryCard from '../components/cards/StoryCard';
import ActorAvatar from '../components/ActorAvatar';
import ActorTitle from '../components/ActorTitle';

const styles = theme => ({
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
});

const LIMIT = 20;

class StoriesContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      queryFilters: props.queryFilters,
    };

    this.offset = 0;
    this.fetchStories = this.fetchStories.bind(this);
  }

  componentWillUnmount() {
    this.props.resetStories();
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

  fetchStories() {
    const { queryFilters } = this.state;
    this.props.browseStories({
      ownerId: queryFilters.oid,
      filter: queryFilters.filter,
      start: this.offset,
      limit: LIMIT,
    });

    this.offset += LIMIT;
  }

  render() {
    const {
      classes,
      stories,
    } = this.props;

    return (
      <React.Fragment>
        <InfiniteScroll
          loadMore={this.fetchStories}
          hasMore
          loader={<CircularProgress key={0} className={classes.progress} />}
        >
          <StackGrid
            columnWidth={this.getColumnWidth()}
            duration={50}
            gutterWidth={16}
            gutterHeight={16}
          >
            {stories.allIds.map((storyId) => {
              const story = stories.byId[storyId];
              const key = `story_${story.id}`;
              const subject = story.subject || {
                id: null,
                name: 'unknown',
                givenName: '?',
                familyName: '?',
                objectType: 'com.people.person',
                imageURL: '',
              };

              const portrait = story.object &&
              story.object.imageURL &&
              story.object.imageURL.medium &&
              story.object.imageURL.medium.url;

              const storyBody = story.object && story.object.body;

              return (
                <StoryCard
                  key={key}
                  author={
                    <ActorTitle
                      actor={subject}
                      typographyProps={{
                          component: 'h4',
                          variant: 'title',
                          className: classes.authorName,
                      }}
                      linked={Boolean(subject.id)}
                    />
                  }
                  authorAvatar={
                    <ActorAvatar
                      actor={subject}
                      linked={Boolean(subject.id)}
                    />
                  }
                  owner={
                    <ActorTitle
                      actor={story.owner}
                      typographyProps={{
                          component: 'h5',
                          variant: 'subheading',
                          className: classes.ownerName,
                      }}
                      linked
                    />
                  }
                  description={storyBody}
                  portrait={portrait}
                  path={`/stories/${story.id}/`}
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

StoriesContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  stories: PropTypes.shape({
    byId: PropTypes.object,
    allIds: PropTypes.array,
  }).isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
};

StoriesContainer.defaultProps = {
  queryFilters: {
    filter: '',
    oid: '',
  },
};

const mapStateToProps = (state) => {
  const {
    stories,
    error,
  } = state.storiesReducer;

  const { viewer } = state.authReducer;

  return {
    stories,
    error,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseStories: (params) => {
      dispatch(browseStories(params));
    },
    resetStories: () => {
      dispatch(resetStories());
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(StoriesContainer)));
