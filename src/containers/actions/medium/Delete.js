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

    const { medium, deleteItem } = this.props;

    deleteItem(medium);
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

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      deleteItem: (medium) => {
        return dispatch(actions[namespace].deleteItem(medium));
      },
    };
  };
};

export default (namespace) => {
  return connect(mapDispatchToProps(namespace))(ActionsMediumDelete);
};
