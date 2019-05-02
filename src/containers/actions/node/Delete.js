import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import actions from '../../../actions/node';
import NodeType from '../../../proptypes/Node';
import i18n from '../../../languages';

class ActionsNodeDelete extends React.Component {
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

    const { node, deleteItem } = this.props;

    deleteItem(node).then(() => {
      this.setState({ isDeleted: true });
    });
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

ActionsNodeDelete.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  node: NodeType.isRequired,
  isDeleted: PropTypes.bool,
};

ActionsNodeDelete.defaultProps = {
  isDeleted: false,
};


const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (node) => {
      return dispatch(actions.deleteItem(node));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsDelete);
