import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import CircularProgress from '@material-ui/core/CircularProgress';
import appActions from '../../actions/app';
import actions from '../../actions/hashtag';
import i18n from '../../languages';
import NodesType from '../../proptypes/Nodes';

class HashtagsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hashtags: {
        byId: {},
        allIds: [],
      },
      sort: 'recent',
    };
  }

  componentWillMount() {
    const { browseHashtags, setAppTitle } = this.props;
    const { sort } = this.state;

    setAppTitle(i18n.t('hashtags:cTitle'));
    browseHashtags({ sort });
  }

  componentWillReceiveProps(nextProps) {
    const { hashtags } = nextProps;
    this.setState({ hashtags });
  }

  componentWillUnmount() {
    const { resetHashtags } = this.props;
    resetHashtags();
  }

  render() {
    const { hashtags } = this.state;
    return (
      <React.Fragment>
        Hashtags {hashtags.allIds.length}
      </React.Fragment>
    );
  }
}

HashtagsBrowse.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  browseHashtags: PropTypes.func.isRequired,
  resetHashtags: PropTypes.func.isRequired,
  hashtags: NodesType.isRequired,
};

const mapStateToProps = (state) => {
  const {
    hashtags,
    error,
  } = state.hashtags;

  return {
    hashtags,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseHashtags: (params) => {
      return dispatch(actions.browse(params));
    },
    resetHashtags: () => {
      return dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse));
