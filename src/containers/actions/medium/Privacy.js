import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import PublicIcon from '@material-ui/icons/Public';
import PrivateIcon from '@material-ui/icons/VpnLock';

import actions from '../../../actions';
import i18n from '../../../languages';
import utils from '../../../utils';
import MediumType from '../../../proptypes/Medium';
import { Access as ACCESS } from '../../../constants';

const ActionsMediumPrivacy = (props) => {
  const {
    medium,
    editPrivacy,
    size,
  } = props;

  const isMounted = useRef(true);
  const [menuAnchorEl, setAnchorEl] = useState(null);
  const [access, setAccess] = useState(medium.access);
  const [waiting, setWaiting] = useState(false);

  const actorType = utils.node.isPerson(medium.owner) ? 'PEOPLE' : 'ACTORS';
  const isPublic = access === ACCESS[actorType].PUBLIC;
  const accessLevels = ACCESS[actorType];

  useEffect(() => {
    if (access !== medium.access) {
      setWaiting(true);
      editPrivacy({
        ...medium,
        access,
      }).then(() => {
        if (isMounted.current) {
          setWaiting(false);
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [access]);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrivacy = (newAccess) => {
    setAccess(newAccess);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-owns={menuAnchorEl ? `medium-card-menu-${medium.id}` : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
        disabled={waiting}
      >
        {isPublic && <PublicIcon fontSize={size} />}
        {!isPublic && <PrivateIcon fontSize={size} />}
      </IconButton>
      <Menu
        id={`medium-privacy-${medium.id}`}
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
      >
        {Object.keys(accessLevels).map((key) => {
          const level = accessLevels[key];
          return (
            <MenuItem
              key={`privacy-level-${level}-${medium.id}`}
              onClick={() => {
                handlePrivacy(level);
              }}
              selected={level === access}
            >
              {i18n.t(`access:${level}`)}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

ActionsMediumPrivacy.propTypes = {
  medium: MediumType.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'inherit']),
  editPrivacy: PropTypes.func.isRequired,
};

ActionsMediumPrivacy.defaultProps = {
  size: 'medium',
};

const mapStateToProps = (namespace) => {
  return () => {
    return {
      namespace,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      editPrivacy: (medium) => {
        return dispatch(actions[namespace].privacy.edit(medium));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActionsMediumPrivacy);
};
