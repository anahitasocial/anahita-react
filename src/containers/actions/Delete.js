import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import * as actions from '../../actions';
import NodeType from '../../proptypes/Node';
import i18n from '../../languages';

class ActionsDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  static getDerivedStateFromProps(nextProps) {
    const { isFetching } = nextProps;
    return { isFetching };
  }

  handleDelete(event) {
    event.preventDefault();

    const { node, deleteItem } = this.props;

    deleteItem(node);
  }

  render() {
    const { isFetching } = this.state;
    const label = i18n.t('actions:delete');
    const onClick = this.handleDelete;

    return (
      <MenuItem
        onClick={onClick}
        disabled={isFetching}
        aria-label={label}
      >
        {label}
      </MenuItem>
    );
  }
}

ActionsDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  node: NodeType.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (node) => {
      const namespace = node.objectType.split('.')[1];
      return dispatch(actions[namespace].deleteItem(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsDelete);
