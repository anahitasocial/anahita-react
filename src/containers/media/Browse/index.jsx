import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../../actions';
import PersonType from '../../../proptypes/Person';
import MediaType from '../../../proptypes/Media';

import MediumStepper from '../Stepper';
import MediaList from './List';
import { App as APP } from '../../../constants';

const {
  LIMIT,
  SORTING: {
    RECENT,
  },
} = APP.BROWSE;

const MediaBrowse = ({
  browseList,
  resetList,
  items,
  namespace,
  viewer,
  isFetching,
  queryFilters = {
    q: '',
    oid: 0,
    sort: RECENT,
  },
  total = 0,
}) => {
  const [start, setStart] = useState(0);
  const [currentId, setCurrentId] = useState(null);
  const [stepperOpen, setStepperOpen] = useState(false);

  const Stepper = useMemo(() => {
    return MediumStepper(namespace);
  }, [namespace]);

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
  }, [start, queryFilters]);

  const handleClose = () => {
    setStepperOpen(false);
    setCurrentId(null);
  };

  const handleView = (mediumId) => {
    setCurrentId(mediumId);
    setStepperOpen(true);
  };

  const fetchList = () => {
    return setStart(start + LIMIT);
  };

  return (
    <>
      {stepperOpen && currentId && (
        <Stepper
          mediumId={currentId}
          open={stepperOpen}
          handleClose={handleClose}
        />
      )}
      <MediaList
        items={items}
        namespace={namespace}
        viewer={viewer}
        total={total}
        fetchList={fetchList}
        handleView={handleView}
      />
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
  isFetching: PropTypes.bool.isRequired,
  total: PropTypes.number,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      total,
      isFetching,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      isFetching,
      viewer,
      total,
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
