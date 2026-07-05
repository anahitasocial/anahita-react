import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import actions from '../../../actions';
import i18n from '../../../languages';
import permissions from '../../../permissions';
import HashtagDefault from '../../../proptypes/HashtagDefault';
import HashtagsType from '../../../proptypes/Hashtags';
import PersonType from '../../../proptypes/Person';

import HashtagMenu from '../Menu';
import Progress from '../../../components/Progress';
import Inbounds from '../../inbounds';

const HashtagsRead = (props) => {
  const {
    readHashtag,
    setAppTitle,
    hashtags: {
      current: hashtag = { ...HashtagDefault },
    },
    inboundsCount,
    isFetching,
    error,
    viewer,
  } = props;
  const { alias: aliasParam } = useParams();

  useEffect(() => {
    readHashtag(aliasParam);
    setAppTitle(i18n.t('hashtags:cTitle'));
  }, [aliasParam, setAppTitle]);

  if (isFetching) {
    return (
      <Progress />
    );
  }

  if (error !== '') {
    return (
      <Navigate to="/404/" replace />
    );
  }

  const canAdminister = permissions.node.canAdminister(viewer);

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
          subheader={i18n.t('inbounds:count', {
            count: inboundsCount,
          })}
          action={canAdminister &&
            <HashtagMenu
              hashtag={hashtag}
            />}
        />
      </Card>
      {hashtag.id > 0 && <Inbounds tag={hashtag} />}
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
  } = state.inbounds;

  const inboundsCount = total;

  const { viewer } = state.session;

  return {
    hashtags,
    inboundsCount,
    error,
    isFetching,
    viewer,
  };
};

HashtagsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readHashtag: PropTypes.func.isRequired,
  hashtags: HashtagsType.isRequired,
  inboundsCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
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
