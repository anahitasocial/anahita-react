import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import actions from '../../actions';
import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

import DialogConfirm from '../../components/DialogConfirm';

const ActionsBlockFollower = React.forwardRef((props, ref) => {
  const {
    blockfollower,
    actor,
    follower,
    alertSuccess,
    alertError,
    confirmTitle,
    confirmMessage,
  } = props;

  const [waiting, setWaiting] = useState(false);

  const handleAction = () => {
    setWaiting(true);
    blockfollower(actor, follower)
      .then(() => {
        alertSuccess(i18n.t('prompts:removed.success'));
      }).catch((err) => {
        console.error(err);
        alertError(i18n.t('prompts:removed.error'));
      });
  };

  const label = i18n.t('actions:block');

  return (
    <DialogConfirm
      title={confirmTitle}
      message={confirmMessage}
      confirm={label}
    >
      <Button
        onClick={handleAction}
        disabled={waiting}
        aria-label={label}
        ref={ref}
      >
        {label}
      </Button>
    </DialogConfirm>
  );
});

ActionsBlockFollower.propTypes = {
  blockfollower: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  follower: PersonType.isRequired,
  confirmTitle: PropTypes.string,
  confirmMessage: PropTypes.string,
};

ActionsBlockFollower.defaultProps = {
  confirmTitle: i18n.t('prompts:confirm.title'),
  confirmMessage: i18n.t('prompts:confirm.message'),
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    blockfollower: (actor, follower) => {
      return dispatch(actions.socialgraph.blockfollower(actor, follower));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionsBlockFollower));
