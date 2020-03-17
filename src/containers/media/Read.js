import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';
// import Container from '@material-ui/core/Container';

import PersonType from '../../proptypes/Person';
import MediaType from '../../proptypes/Media';
import MediumDefault from '../../proptypes/MediumDefault';
import MediumComments from '../comments/Browse';
import Progress from '../../components/Progress';
import MediumCard from './Card';

import * as actions from '../../actions';
import i18n from '../../languages';

const MediaRead = (props) => {
  const {
    namespace,
    readMedium,
    setAppTitle,
    isFetching,
    viewer,
    isAuthenticated,
    media,
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    readMedium(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, []);

  const medium = media.current || { ...MediumDefault };
  const canComment = isAuthenticated && medium.openToComment;
  // const maxWidth = ['article', 'topic'].includes(medium.objectType.split('.')[2]) ? 'md' : 'sm';

  return (
    <React.Fragment>
      {medium.id > 0 &&
      <Helmet>
        <title>
          {medium.name || striptags(medium.body).substring(0, 60)}
        </title>
        <meta name="description" content={striptags(medium.body)} />
      </Helmet>
      }
      {isFetching && !medium.id &&
        <Progress />
      }
      {medium.id > 0 &&
        <React.Fragment>
          <MediumCard
            medium={medium}
            viewer={viewer}
          />
          {canComment &&
            <MediumComments
              parent={medium}
              canAdd
            />
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
};

MediaRead.propTypes = {
  readMedium: PropTypes.func.isRequired,
  media: MediaType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
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
      readMedium: (id) => {
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
