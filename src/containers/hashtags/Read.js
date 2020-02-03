import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import appActions from '../../actions/app';
import { hashtags as actions } from '../../actions';
import i18n from '../../languages';
import HashtagDefault from '../../proptypes/HashtagDefault';

import Progress from '../../components/Progress';
import TaggablesBrowse from '../taggables/Browse';
import { App as APP } from '../../constants';

const { TOP, RECENT } = APP.BROWSE.SORTING;
const TABS = [TOP, RECENT];

const styles = {
  card: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
};

class HashtagsRead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashtag: { ...HashtagDefault },
      isFetching: false,
      error: '',
      sort: 'top',
      selectedTab: 0,
      taggablesCount: 0,
    };

    this.changeTab = this.changeTab.bind(this);

    const {
      readHashtag,
      setAppTitle,
      match: {
        params: {
          alias,
        },
      },
    } = props;

    readHashtag(alias);
    setAppTitle(i18n.t('hashtags:cTitle'));
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      hashtags,
      taggablesCount,
      isFetching,
      error,
    } = nextProps;

    return {
      hashtag: hashtags.current,
      taggablesCount,
      isFetching,
      error,
    };
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
      taggablesCount,
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
        <Progress />
      );
    }

    return (
      <React.Fragment>
        <Card
          square
          style={styles.card}
        >
          <CardHeader
            avatar={
              <Avatar>
                #
              </Avatar>
            }
            title={
              <Typography variant="h6">
                {hashtag.name}
              </Typography>
            }
            subheader={i18n.t('taggables:count', {
              count: taggablesCount,
            })}
          />
          <Divider light />
          <Tabs
            value={selectedTab}
            onChange={this.changeTab}
            centered
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Top" />
            <Tab label="Recent" />
          </Tabs>
        </Card>
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

  const {
    total,
  } = state.taggables;

  const taggablesCount = total;

  return {
    hashtags,
    taggablesCount,
    error,
    isFetching,
  };
};

HashtagsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readHashtag: PropTypes.func.isRequired,
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
