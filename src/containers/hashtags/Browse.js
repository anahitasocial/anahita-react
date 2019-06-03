import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import appActions from '../../actions/app';
import actions from '../../actions/hashtag';
import i18n from '../../languages';
import HashtagsType from '../../proptypes/Hashtags';

const styles = (theme) => {
  return {
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
    button: {
      margin: 2,
    },
    tabs: {
      marginBottom: theme.spacing.unit,
    },
  };
};

const LIMIT = 20;
const SORT_TRENDING = 'trending';
const SORT_TOP = 'top';
const SROT_RECENT = 'recent';

const TABS = [SORT_TRENDING, SORT_TOP, SROT_RECENT];

class HashtagsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hashtags: {
        byId: {},
        allIds: [],
      },
      sort: 'trending',
      error: '',
      isFetching: false,
      hasMore: true,
      selectedTab: 0,
    };

    this.offset = 0;
    this.fetchList = this.fetchList.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  componentWillMount() {
    const { setAppTitle } = this.props;
    setAppTitle(i18n.t('hashtags:cTitle'));
  }

  componentWillReceiveProps(nextProps) {
    const {
      hashtags,
      error,
      isFetching,
      hasMore,
    } = nextProps;

    this.setState({
      hashtags,
      error,
      isFetching,
      hasMore,
    });
  }

  componentWillUnmount() {
    const { resetHashtags } = this.props;
    resetHashtags();
  }

  fetchList() {
    const { sort } = this.state;
    const { browseHashtags } = this.props;

    browseHashtags({
      sort,
      start: this.offset,
      limit: LIMIT,
    });

    this.offset += LIMIT;
  }

  changeTab(event, value) {
    const { resetHashtags } = this.props;

    this.setState({
      selectedTab: value,
      sort: TABS[value],
    });

    this.offset = 0;
    resetHashtags();
  }

  render() {
    const { classes } = this.props;
    const {
      hashtags,
      error,
      isFetching,
      hasMore,
      selectedTab,
    } = this.state;

    return (
      <React.Fragment>
        <Tabs
          value={selectedTab}
          onChange={this.changeTab}
          centered
          className={classes.tabs}
        >
          <Tab label="Trending" />
          <Tab label="Top" />
          <Tab label="Recent" />
        </Tabs>
        <InfiniteScroll
          loadMore={this.fetchList}
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
          {hashtags.allIds.map((hashtagId) => {
            const hashtag = hashtags.byId[hashtagId];
            const key = `medium_${hashtag.id}`;
            return (
              <Button
                key={key}
                href={`/hashtags/${hashtag.alias}/`}
                color="primary"
                className={classes.button}
              >
                {`#${hashtag.name}`}
              </Button>
            );
          })}
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

HashtagsBrowse.propTypes = {
  classes: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  browseHashtags: PropTypes.func.isRequired,
  resetHashtags: PropTypes.func.isRequired,
  hashtags: HashtagsType.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    hashtags,
    error,
    isFetching,
    hasMore,
  } = state.hashtags;

  return {
    hashtags,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseHashtags: (params) => {
      return dispatch(actions.browse(params));
    },
    resetHashtags: () => {
      return dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse));
