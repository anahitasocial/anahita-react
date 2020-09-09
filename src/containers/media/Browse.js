import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';

import Masonry from '../../components/BreakpointMasonry';
import MediumCard from './Card';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';

const { LIMIT } = APP.BROWSE;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const MediaBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    items,
    namespace,
    viewer,
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

  return (
    <InfiniteScroll
      loadMore={fetchList}
      hasMore={hasMore}
      loader={
        <Progress key={`${namespace}-progress`} />
      }
    >
      <Masonry>
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `${namespace}_node_list_item${node.id}`;
          return (
            <div
              className={classes.card}
              key={key}
            >
              <MediumCard
                medium={node}
                viewer={viewer}
              />
            </div>
          );
        })
        }
      </Masonry>
    </InfiniteScroll>
  );
};

MediaBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
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
  )(MediaBrowse);
};
