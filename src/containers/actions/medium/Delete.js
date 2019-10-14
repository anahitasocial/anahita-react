import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import * as actions from '../../../actions';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

class ActionsMediumDelete extends React.Component {
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

    const { medium, deleteItem } = this.props;
    const namespace = medium.objectType.split('.')[1];

    deleteItem(medium, namespace);
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

ActionsMediumDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
  isDeleted: PropTypes.bool,
};

ActionsMediumDelete.defaultProps = {
  isDeleted: false,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (medium, namespace) => {
      return dispatch(actions[namespace].deleteItem(medium));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsMediumDelete);
