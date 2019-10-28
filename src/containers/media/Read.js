import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import striptags from 'striptags';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import appActions from '../../actions/app';
import * as actions from '../../actions';
import i18n from '../../languages';

import MediaCard from './Card';
import MediumDefault from '../../proptypes/MediumDefault';
import MediumComments from '../comments/Browse';
import permissions from '../../permissions/comment';

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
    const { isFetching } = this.props;
    const canAdd = permissions.canAdd(medium);

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
        <Grid
          container
          justify="center"
          alignItems="center"
        >
          <Grid item>
            {isFetching &&
              <CircularProgress />
            }
            {medium.id > 0 &&
              <React.Fragment>
                <MediaCard
                  medium={medium}
                />
                <MediumComments
                  parent={medium}
                  canAdd
                />
              </React.Fragment>
            }
          </Grid>
        </Grid>
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
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
    } = state[namespace];

    const {
      isAuthenticated,
      viewer,
    } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
      error,
      isAuthenticated,
      viewer,
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
        dispatch(appActions.setAppTitle(title));
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
