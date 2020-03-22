import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withWidth from '@material-ui/core/withWidth';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import i18n from '../../languages';

import MediumCard from './Card';
import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

import utils from '../utils';

const { LIMIT } = APP.BROWSE;

const MediaBrowse = (props) => {
  const {
    setAppTitle,
    browseMedia,
    resetMedia,
    media,
    namespace,
    viewer,
    width,
    hasMore,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const { q } = queryFilters;
    browseMedia({
      q,
      start: page * LIMIT,
      limit: LIMIT,
      ...queryFilters,
    }, namespace);
  };

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));

    return () => {
      resetMedia();
    };
  }, []);

  const columnWidth = utils.getColumnWidthPercentage(width);

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
      pageStart={-1}
      loader={
        <Progress key={`${namespace}-progress`} />
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
              viewer={viewer}
            />
          );
        })
        }
      </StackGrid>
    </InfiniteScroll>
  );
};

MediaBrowse.propTypes = {
  browseMedia: PropTypes.func.isRequired,
  resetMedia: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  media: MediaType.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

MediaBrowse.defaultProps = {
  queryFilters: {
    q: '',
  },
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      hasMore,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
      error,
      hasMore,
      viewer,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseMedia: (params) => {
        return dispatch(actions[namespace].browse(params, namespace));
      },
      resetMedia: () => {
        return dispatch(actions[namespace].reset(namespace));
      },
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(withWidth()(MediaBrowse));
};
