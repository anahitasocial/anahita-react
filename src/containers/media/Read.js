import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';
import MediumComments from '../comments/Browse';
import Progress from '../../components/Progress';
import LocationsGadget from '../locations/Gadget';
import LikeAction from '../actions/Like';
import MediumMenu from './Menu';
import Medium from '../../components/medium';


import * as actions from '../../actions';
import i18n from '../../languages';

const MediaRead = (props) => {
  const {
    namespace,
    readItem,
    setAppTitle,
    isFetching,
    viewer,
    isAuthenticated,
    error,
    media: {
      current: medium,
    },
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    readItem(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, []);

  const canAdd = isAuthenticated && medium.openToComment;

  if (isFetching && !medium.id) {
    return (
      <Progress />
    );
  }

  if (!medium.id && error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>
          {medium.name || striptags(medium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(medium.body)} />
      </Helmet>
      {medium.id &&
        <Medium
          medium={medium}
          menu={isAuthenticated &&
            <MediumMenu
              medium={medium}
              viewer={viewer}
            />
          }
          actions={isAuthenticated &&
            <LikeAction
              node={medium}
              liked={medium.isVotedUp}
            />
          }
          comments={
            <MediumComments
              parent={medium}
              canAdd={canAdd}
            />
          }
          locations={
            <LocationsGadget node={medium} />
          }
        />
      }
    </React.Fragment>
  );
};

MediaRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  media: MediaType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  setAppTitle: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
    } = state[namespace];

    const { viewer, isAuthenticated } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
      error,
      viewer,
      isAuthenticated,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readItem: (id) => {
        dispatch(actions[namespace].read(id, namespace));
      },
      setAppTitle: (title) => {
        dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(MediaRead);
};
