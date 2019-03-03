import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';

import LikeIcon from '@material-ui/icons/FavoriteBorder';
import UnlikeIcon from '@material-ui/icons/Favorite';

import actions from '../../actions/likes';
import MediumType from '../../proptypes/Medium';
import i18n from '../../languages';

class LikeAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      isFetching: false,
    };

    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentWillMount() {
    const { isLiked } = this.props;
    this.setState({ isLiked });
  }

  componentWillReceiveProps() {
    this.setState({ isFetching: false });
  }

  handleLike(event) {
    event.preventDefault();

    const { medium, likeMedium } = this.props;

    likeMedium(medium);

    this.setState({ isLiked: true });
  }

  handleUnlike(event) {
    event.preventDefault();

    const { medium, unlikeMedium } = this.props;

    unlikeMedium(medium);

    this.setState({ isLiked: false });
  }

  render() {
    const { isLiked, isFetching } = this.state;
    const label = isLiked ? i18n.t('actions:unlike') : i18n.t('actions:like');
    const onClick = isLiked ? this.handleUnlike : this.handleLike;
    const color = isLiked ? 'primary' : 'inherit';

    return (
      <IconButton
        onClick={onClick}
        disabled={isFetching}
        color={color}
        aria-label={label}
      >
        {isLiked &&
          <UnlikeIcon />
        }
        {!isLiked &&
          <LikeIcon />
        }
      </IconButton>
    );
  }
}

LikeAction.propTypes = {
  likeMedium: PropTypes.func.isRequired,
  unlikeMedium: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  isLiked: PropTypes.bool,
};

LikeAction.defaultProps = {
  isLiked: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    likeMedium: (medium) => {
      dispatch(actions.add(medium));
    },
    unlikeMedium: (medium) => {
      dispatch(actions.deleteLike(medium));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LikeAction);
