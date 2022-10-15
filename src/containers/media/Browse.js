import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import actions from '../../actions';
import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';

import MediumStepper from './Stepper';
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
    isFetching,
    queryFilters,
  } = props;

  const [start, setStart] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [current, setCurrent] = useState(items.allIds[0]);
  const [stepperOpen, setStepperOpen] = useState(false);

  useEffect(() => {
    return () => {
      resetList();
    };
  }, []);

  useEffect(() => {
    if (!isFetching) {
      browseList({
        start,
        limit: LIMIT,
        ...queryFilters,
      }, namespace);
    }
  }, [start]);

  const handleClose = () => {
    setStepperOpen(false);
  };

  // const handleView = (e, medium) => {
  // setCurrent(medium.id);
  //  setStepperOpen(true);
  // };

  function fetchList() {
    return setStart(start + LIMIT);
  }

  const Stepper = MediumStepper(namespace);

  return (
    <>
      {useMemo(() => {
        if (stepperOpen && current) {
          return (
            <Stepper
              mediumId={current}
              open={stepperOpen}
              handleClose={handleClose}
            />
          );
        }

        return (
          <></>
        );
      }, [stepperOpen, current])}
      <InfiniteScroll
        dataLength={items.allIds.length}
        // eslint-disable-next-line react/jsx-no-bind
        next={fetchList}
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
                  // handleView={(e, medium) => {
                  //  return handleView(e, medium);
                  // }}
                />
              </div>
            );
          })}
        </Masonry>
      </InfiniteScroll>
    </>
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
  isFetching: PropTypes.bool.isRequired,
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
      isFetching,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      hasMore,
      isFetching,
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
