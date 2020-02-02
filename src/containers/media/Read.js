import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';
// import Container from '@material-ui/core/Container';

import PersonType from '../../proptypes/Person';
import MediumDefault from '../../proptypes/MediumDefault';
import MediumComments from '../comments/Browse';
import Progress from '../../components/Progress';
import MediumCard from './Card';

import * as actions from '../../actions';
import i18n from '../../languages';

class MediaRead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      medium: { ...MediumDefault },
    };

    const {
      namespace,
      readMedium,
      setAppTitle,
      match: {
        params: {
          id,
        },
      },
    } = props;

    readMedium(id, namespace);
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  static getDerivedStateFromProps(nextProps) {
    const { media } = nextProps;
    return {
      medium: media.current,
    };
  }

  render() {
    const { medium } = this.state;
    const {
      isFetching,
      viewer,
      isAuthenticated,
    } = this.props;

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
  }
}

MediaRead.propTypes = {
  readMedium: PropTypes.func.isRequired,
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
