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
import { App as APP } from '../../constants';

import utils from '../../utils/node';
import containersUtils from '../utils';

const {
  LIMIT,
  SORTING: {
    TOP,
    RECENT,
    RELEVANT,
  },
} = APP.BROWSE;

const SearchBrowse = (props) => {
  const {
    browseSearch,
    resetSearch,
    search,
    error,
    hasMore,
    queryParams: {
      sort,
      q,
      scope,
    },
    width,
  } = props;

  useEffect(() => {
    return () => {
      resetSearch();
    };
  }, []);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseSearch({
      sort,
      start,
      scope,
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
        {search.allIds.map((nodeId) => {
            const node = search.byId[nodeId];
            const key = `taggable_${node.id}`;
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
    search,
    error,
    hasMore,
  } = state.search;

  return {
    search,
    error,
    hasMore,
  };
};

SearchBrowse.propTypes = {
  resetSearch: PropTypes.func.isRequired,
  browseSearch: PropTypes.func.isRequired,
  search: NodesType.isRequired,
  queryParams: PropTypes.shape({
    sort: PropTypes.oneOf([TOP, RECENT, RELEVANT]),
    q: PropTypes.string,
    scope: PropTypes.string,
  }).isRequired,
  width: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseSearch: (params) => {
      return dispatch(actions.search.browse(params));
    },
    resetSearch: () => {
      return dispatch(actions.search.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(SearchBrowse));
