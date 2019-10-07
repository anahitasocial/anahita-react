import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions/stories';
import StoryType from '../../../proptypes/Story';
import i18n from '../../../languages';

class ActionsStoryDelete extends React.Component {
  constructor(props) {
    super(props);

    const { isDeleted } = props;

    this.state = {
      isDeleted,
      isFetching: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { isFetching } = nextProps;

    if (isFetching !== state.isFetching) {
      return { isFetching };
    }

    return null;
  }

  handleDelete(event) {
    event.preventDefault();

    const { story, deleteItem } = this.props;

    deleteItem(story);

    this.setState({ isDeleted: true });
  }

  render() {
    const { isDeleted, isFetching } = this.state;
    const label = i18n.t('actions:delete');
    const onClick = this.handleDelete;
    const color = isDeleted ? 'primary' : 'inherit';

    return (
      <MenuItem
        onClick={onClick}
        disabled={isFetching}
        color={color}
        aria-label={label}
      >
        {label}
      </MenuItem>
    );
  }
}

ActionsStoryDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  story: StoryType.isRequired,
  isDeleted: PropTypes.bool,
};

ActionsStoryDelete.defaultProps = {
  isDeleted: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (story) => {
      dispatch(actions.deleteItem(story));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsStoryDelete);
