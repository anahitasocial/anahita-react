import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import actions from '../../actions';
import i18n from '../../languages';
import HashtagDefault from '../../proptypes/HashtagDefault';
import HashtagsType from '../../proptypes/Hashtags';

import Progress from '../../components/Progress';
import Taggables from '../taggables';

const HashtagsRead = (props) => {
  const {
    readHashtag,
    setAppTitle,
    hashtags: {
      current: hashtag = { ...HashtagDefault },
    },
    taggablesCount,
    isFetching,
    error,
    match: {
      params: {
        alias,
      },
    },
  } = props;

  useEffect(() => {
    readHashtag(alias);
    setAppTitle(i18n.t('hashtags:cTitle'));
  }, []);

  if (isFetching) {
    return (
      <Progress />
    );
  }

  if (error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  return (
    <>
      <Card variant="outlined" square>
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
      </Card>
      {hashtag.id > 0 && <Taggables tag={hashtag} />}
    </>
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
      return dispatch(actions.hashtags.read(alias));
    },
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(HashtagsRead));
