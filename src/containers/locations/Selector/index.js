import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  geolocated,
  geoPropTypes,
} from 'react-geolocated';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close';

import NodeType from '../../../proptypes/Node';
import BrowseLocations from './Browse';
import AddLocation from './Add';
import i18n from '../../../languages';

const TABS = {
  SEARCH: 'search',
  ADD: 'add',
};

const useStyles = makeStyles((theme) => {
  return {
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  };
});

const LocationsSelector = (props) => {
  const classes = useStyles();
  const {
    node,
    isOpen,
    handleClose,
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = props;

  const [tab, setTab] = useState(TABS.SEARCH);
  const [keyword, setKeyword] = useState('');

  const here = {
    longitude: 0,
    latitude: 0,
  };

  const changeTab = (event, value) => {
    setTab(value);
  };

  if (node.longitude && node.latitude) {
    here.longitude = node.longitude;
    here.latitude = node.latitude;
  } else if (
    isGeolocationAvailable &&
    isGeolocationEnabled &&
    coords
  ) {
    here.longitude = coords.longitude;
    here.latitude = coords.latitude;
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {i18n.t('locations:add.cTitle')}
          <IconButton
            onClick={handleClose}
            style={{
              float: 'right',
            }}
            className={classes.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider light />
        <AppBar
          position="sticky"
          color="inherit"
          elevation={1}
        >
          <Tabs
            value={tab}
            onChange={changeTab}
            centered
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={i18n.t('actions:search')} value={TABS.SEARCH} />
            <Tab label={i18n.t('actions:add')} value={TABS.ADD} />
          </Tabs>
        </AppBar>
        {tab === TABS.SEARCH &&
          <BrowseLocations
            node={node}
            queryFilters={{
              nearby_latitude: here.latitude,
              nearby_longitude: here.longitude,
            }}
            handleClose={handleClose}
            noResultsCallback={(newKeyword) => {
              setKeyword(newKeyword);
              setTab(TABS.ADD);
            }}
          />}
        {tab === TABS.ADD &&
          <AddLocation
            node={node}
            name={keyword}
            callback={() => {
              handleClose();
            }}
          />}
      </Dialog>
    </>
  );
};

LocationsSelector.propTypes = {
  node: NodeType.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  ...geoPropTypes,
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocationsSelector);
