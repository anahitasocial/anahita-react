import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ToolBar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import appActions from '../../actions/app';
import actions from '../../actions/hashtag';
import i18n from '../../languages';
import HashtagsType from '../../proptypes/Hashtags';
import HashtagDefault from '../../proptypes/HashtagDefault';

import TaggablesBrowse from '../taggables/Browse';

const SORT_TOP = 'top';
const SROT_RECENT = 'recent';

const TABS = [SORT_TOP, SROT_RECENT];

class HashtagsRead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashtag: { ...HashtagDefault },
      isFetching: false,
      error: '',
      sort: 'top',
      selectedTab: 0,
    };

    const {
      match: {
        params: {
          alias,
        },
      },
    } = props;

    this.alias = alias;
    this.changeTab = this.changeTab.bind(this);
  }

  componentWillMount() {
    const { readHashtag, setAppTitle } = this.props;
    readHashtag(this.alias);
    setAppTitle(i18n.t('hashtags:cTitle'));
  }

  componentWillReceiveProps(nextProps) {
    const {
      hashtags,
      isFetching,
      error,
    } = nextProps;

    this.setState({
      hashtag: hashtags.current,
      isFetching,
      error,
    });
  }

  changeTab(event, value) {
    this.setState({
      selectedTab: value,
      sort: TABS[value],
    });
  }

  render() {
    const {
      hashtag,
      isFetching,
      error,
      selectedTab,
      sort,
    } = this.state;

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    if (isFetching) {
      return (
        <Grid
          container
          justify="center"
          alignItems="center"
          key="actors-progress"
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <React.Fragment>
        <ToolBar>
          <Typography variant="h4" color="inherit">
            {`#${hashtag.name}`}
          </Typography>
        </ToolBar>
        <Divider />
        <Tabs
          value={selectedTab}
          onChange={this.changeTab}
          centered
          variant="fullWidth"
        >
          <Tab label="Top" />
          <Tab label="Recent" />
        </Tabs>
        {hashtag.id && selectedTab === 0 &&
          <TaggablesBrowse tag={hashtag} sorting={sort} />
        }
        {hashtag.id && selectedTab === 1 &&
          <TaggablesBrowse tag={hashtag} sorting={sort} />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    hashtags,
    error,
    isFetching,
  } = state.hashtags;

  return {
    hashtags,
    error,
    isFetching,
  };
};

HashtagsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readHashtag: PropTypes.func.isRequired,
  hashtags: HashtagsType.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readHashtag: (alias) => {
      return dispatch(actions.read(alias));
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(HashtagsRead));
