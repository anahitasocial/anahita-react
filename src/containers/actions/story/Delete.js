import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions/stories';
import StoryType from '../../../proptypes/Story';
import i18n from '../../../languages';

class StoryActionDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: false,
      isFetching: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    const { isDeleted } = this.props;
    this.setState({ isDeleted });
  }

  componentWillReceiveProps() {
    this.setState({ isFetching: false });
  }

  handleDelete(event) {
    event.preventDefault();

    const { story, deleteStory } = this.props;

    deleteStory(story);

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

StoryActionDelete.propTypes = {
  deleteStory: PropTypes.func.isRequired,
  story: StoryType.isRequired,
  isDeleted: PropTypes.bool,
};

StoryActionDelete.defaultProps = {
  isDeleted: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteStory: (story) => {
      dispatch(actions.deleteStory(story));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryActionDelete);
