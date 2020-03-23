import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import InfiniteScroll from 'react-infinite-scroller';
import StackGrid from 'react-stack-grid';

import taggableActions from '../../actions/taggable';
import NodeType from '../../proptypes/Node';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/Card';
import MediaCard from '../media/Card';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

import utils from '../../utils';
import containersUtils from '../utils';

const {
  LIMIT,
  SORTING: {
    TOP,
    RECENT,
  },
} = APP.BROWSE;

const TaggablesBrowse = (props) => {
  const {
    browseTaggables,
    resetTaggables,
    tag,
    taggables,
    error,
    hasMore,
    sort,
    width,
  } = props;

  useEffect(() => {
    return () => {
      resetTaggables();
    };
  }, []);

  const fetchList = (page) => {
    const start = (page - 1) * LIMIT;
    browseTaggables({
      tag,
      sort,
      start,
      limit: LIMIT,
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
        <Progress key="taggables-progress" />
      }
    >
      <StackGrid
        columnWidth={columnWidth}
        duration={50}
        gutterWidth={16}
        gutterHeight={16}
      >
        {taggables.allIds.map((nodeId) => {
            const taggable = taggables.byId[nodeId];
            const key = `taggable_${taggable.id}`;
            const namespace = taggable.objectType.split('.')[1];
            return (
              <React.Fragment key={key}>
                {utils.isActor(taggable) &&
                  <ActorsCard actor={taggable} />
                }
                {utils.isMedium(taggable) &&
                  <MediaCard
                    medium={taggable}
                    namespace={namespace}
                  />
                }
                {utils.isComment(taggable) &&
                  <CommentCard
                    comment={taggable}
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
    taggables,
    error,
    hasMore,
  } = state.taggables;

  return {
    taggables,
    error,
    hasMore,
  };
};

TaggablesBrowse.propTypes = {
  resetTaggables: PropTypes.func.isRequired,
  browseTaggables: PropTypes.func.isRequired,
  tag: NodeType.isRequired,
  taggables: NodesType.isRequired,
  sort: PropTypes.oneOf([TOP, RECENT]),
  width: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

TaggablesBrowse.defaultProps = {
  sort: TOP,
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseTaggables: (params) => {
      return dispatch(taggableActions.browse(params));
    },
    resetTaggables: () => {
      return dispatch(taggableActions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(TaggablesBrowse));
