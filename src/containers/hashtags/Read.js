import React, { useEffect, useState } from 'react';
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
import HashtagsType from '../../proptypes/Hashtags';

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

const HashtagsRead = (props) => {
  const {
    readHashtag,
    setAppTitle,
    hashtags,
    taggablesCount,
    isFetching,
    error,
    match: {
      params: {
        alias,
      },
    },
  } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const [sort, setSort] = useState(TOP);

  const changeTab = (event, value) => {
    setSelectedTab(value);
    setSort(TABS[value]);
  };

  useEffect(() => {
    readHashtag(alias);
    setAppTitle(i18n.t('hashtags:cTitle'));
  }, []);

  const hashtag = hashtags.current || { ...HashtagDefault };

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
          onChange={changeTab}
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
        <TaggablesBrowse
          tag={hashtag}
          sort={sort}
        />
      }
      {hashtag.id && selectedTab === 1 &&
        <TaggablesBrowse
          tag={hashtag}
          sort={sort}
        />
      }
    </React.Fragment>
  );
};

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
  hashtags: HashtagsType.isRequired,
  match: PropTypes.object.isRequired,
  taggablesCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
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
