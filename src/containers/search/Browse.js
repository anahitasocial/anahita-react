import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import InfiniteScroll from 'react-infinite-scroller';
import StackGrid from 'react-stack-grid';

import * as actions from '../../actions';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/Card';
import MediaCard from '../media/Card';
import Progress from '../../components/Progress';
import { App as APP, Search as SEARCH } from '../../constants';

import utils from '../../utils/node';
import containersUtils from '../utils';

const { LIMIT } = APP.BROWSE;

const {
  RELEVANT,
  RECENT,
} = SEARCH.SORTING;

const SearchBrowse = (props) => {
  const {
    browseList,
    resetList,
    items,
    error,
    hasMore,
    queryParams: {
      sort,
      q,
      scope,
      coordLong,
      coordLat,
      searchRange,
      searchComments,
    },
    width,
  } = props;

  useEffect(() => {
    return () => {
      resetList();
    };
  }, [resetList]);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseList({
      sort,
      start,
      scope,
      search_range: searchRange <= 100 ? searchRange : '',
      search_comments: searchComments,
      coord_lng: searchRange <= 100 ? coordLong : '',
      coord_lat: searchRange <= 100 ? coordLat : '',
      limit: LIMIT,
      term: q,
    });
  };

  const columnWidth = containersUtils.getColumnWidthPercentage(width);

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key="search-progress" />
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
            const key = `search_node_${node.id}`;
            const namespace = node.objectType.split('.')[1];
            return (
              <React.Fragment key={key}>
                {utils.isActor(node) &&
                  <ActorsCard actor={node} />
                }
                {utils.isMedium(node) &&
                  <MediaCard
                    medium={node}
                    namespace={namespace}
                  />
                }
                {utils.isComment(node) &&
                  <CommentCard
                    comment={node}
                  />
                }
              </React.Fragment>
            );
          })
        }
      </StackGrid>
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => {
  const {
    search: items,
    error,
    hasMore,
  } = state.search;

  return {
    items,
    error,
    hasMore,
  };
};

SearchBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  items: NodesType.isRequired,
  queryParams: PropTypes.shape({
    sort: PropTypes.oneOf([RELEVANT, RECENT]),
    q: PropTypes.string,
    scope: PropTypes.string,
    searchRange: PropTypes.number,
    searchComments: PropTypes.bool,
    coordLong: PropTypes.number,
    coordLat: PropTypes.number,
  }).isRequired,
  width: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.search.browse(params));
    },
    resetList: () => {
      return dispatch(actions.search.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(SearchBrowse));
