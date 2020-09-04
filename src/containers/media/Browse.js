import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withWidth from '@material-ui/core/withWidth';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';

import MediumCard from './Card';
import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

import utils from '../utils';

const { LIMIT } = APP.BROWSE;

const MediaBrowse = (props) => {
  const {
    browseList,
    resetList,
    items,
    namespace,
    viewer,
    width,
    hasMore,
    queryFilters,
  } = props;

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseList({
      start,
      limit: LIMIT,
      ...queryFilters,
    }, namespace);
  };

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

  const columnWidth = utils.getColumnWidthPercentage(width);

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
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
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `${namespace}_node_list_item${node.id}`;
          return (
            <MediumCard
              key={key}
              medium={node}
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
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  items: MediaType.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

MediaBrowse.defaultProps = {
  queryFilters: {
    q: '',
    oid: 0,
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
      items: state[namespace][namespace],
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
      browseList: (params) => {
        return dispatch(actions[namespace].browse(params, namespace));
      },
      resetList: () => {
        return dispatch(actions[namespace].reset(namespace));
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
