/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import * as actions from '../../../actions';
import * as api from '../../../api';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

const ActionsMediumCommentStatus = React.forwardRef((props, ref) => {
  const {
    medium,
    read,
  } = props;

  const [isFetching, setIsFetching] = useState(false);

  const handleAction = (event) => {
    event.preventDefault();

    const payload = { ...medium };
    const namespace = medium.objectType.split('.')[1];

    payload.openToComment = !medium.openToComment;

    setIsFetching(true);

    api.commentStatus(namespace).edit(payload).then(() => {
      return read(medium).then(() => {
        return setIsFetching(false);
      });
    }).catch((error) => {
      console.error(error);
    });
  };

  const label = medium.openToComment ? i18n.t('actions:closeComments') : i18n.t('actions:openComments');

  return (
    <MenuItem
      onClick={handleAction}
      aria-label={label}
      disabled={isFetching}
      ref={ref}
    >
      {label}
    </MenuItem>
  );
});

ActionsMediumCommentStatus.propTypes = {
  read: PropTypes.func.isRequired,
  medium: MediumType.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    read: (medium) => {
      const namespace = medium.objectType.split('.')[1];
      return dispatch(actions[namespace].read(medium.id, namespace));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsMediumCommentStatus);
