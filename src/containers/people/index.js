import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';

import ActorsBrowse from '../actors/browse';
import SelectUsertype from '../../components/select/Usertype';

import PersonType from '../../proptypes/Person';
import actions from '../../actions';
import i18n from '../../languages';
import utils from '../../utils';

const { isAdmin } = utils.node;

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginBottom: 8 * 2,
      position: 'sticky',
      top: 8 * 7,
      zIndex: 8,
    },
    filter: {
      margin: theme.spacing(2),
    },
  };
});

const Browse = ActorsBrowse('people');

const People = (props) => {
  const classes = useStyles();
  const {
    viewer,
    setAppTitle,
  } = props;

  const [disabled, setDisabled] = useState(false);
  const [usertype, setUsertype] = useState('');

  useEffect(() => {
    setAppTitle(i18n.t('people:cTitle'));
  }, []);

  const handleDisabled = (e, value) => {
    setDisabled(value);
  };

  const handleUsertype = (e) => {
    const { value } = e.target;
    setUsertype(value);
  };

  let key = 'filter';

  if (disabled) {
    key += '-disabled';
  }

  if (usertype !== '') {
    key += `-${usertype}`;
  }

  return (
    <>
      {isAdmin(viewer) &&
        <AppBar
          position="sticky"
          color="inherit"
          className={classes.root}
          variant="outlined"
        >
          <Toolbar disableGutters>
            <FormControl
              variant="outlined"
              fullWidth
              margin="normal"
              className={classes.filter}
            >
              <InputLabel id="person-type-filter-label">
                {i18n.t('people:person.usertype')}
              </InputLabel>
              <SelectUsertype
                id="person-type-filter-label"
                name="usertype"
                label="Person Type"
                value={usertype}
                onChange={handleUsertype}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  name="enabled"
                  checked={disabled}
                  onChange={handleDisabled}
                />
              }
              className={classes.filter}
              label={i18n.t('commons:disabled')}
            />
          </Toolbar>
        </AppBar>}
      {useMemo(() => {
        return (
          <Browse
            queryFilters={{
              'filter[disabled]': disabled ? 1 : 0,
              'filter[usertype]': usertype,
            }}
            key={key}
          />
        );
      }, [
        disabled,
        usertype,
      ])}
    </>
  );
};

People.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return { viewer };
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People);
