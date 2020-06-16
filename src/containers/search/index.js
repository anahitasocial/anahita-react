import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

import SearchBrowse from './Browse';
import { app as appActions } from '../../actions';
import { Search as SEARCH } from '../../constants';
import i18n from '../../languages';

const { SCOPE, SORTING } = SEARCH;

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginBottom: 8 * 2,
      position: 'sticky',
      top: 8 * 7,
      zIndex: 8,
    },
    formControl: {
      width: theme.spacing(20),
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(2),
    },
    formControlLabel: {
      marginTop: theme.spacing(3),
    },
  };
});

const Search = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    location: {
      search,
    },
  } = props;

  const { q } = queryString.parse(search);

  const [scope, setScope] = useState(SCOPE.ALL);
  const [sort, setSort] = useState(SORTING.RELEVANT);
  const [searchComments, setSearchComments] = useState(false);
  const [searchRange, setSearchRange] = useState(25);

  const changeScope = (event, value) => {
    setScope(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('search:cTitle'));
  }, []);

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        elevation={1}
      >
        <Toolbar>
          <FormGroup row>
            <FormControl
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="search-sort-label">Sort</InputLabel>
              <Select
                labelId="search-sort-label"
                id="search-sort-select"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                }}
                label="Age"
              >
                <MenuItem value={SORTING.RELEVANT}>Most Relevant</MenuItem>
                <MenuItem value={SORTING.RECENT}>Most Recent</MenuItem>
                <MenuItem value={SORTING.DISTANCE}>Near me</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
            >
              <Slider
                value={searchRange}
                getAriaValueText={(value) => {
                  return `${value} km`;
                }}
                onChange={(event, value) => {
                  setSearchRange(value);
                }}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={100}
                disabled={sort !== SORTING.DISTANCE}
              />
            </FormControl>
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Switch
                  checked={searchComments}
                  onChange={() => {
                    setSearchComments(!searchComments);
                  }}
                />
              }
              label="Include Comments"
            />
          </FormGroup>
        </Toolbar>
        <Tabs
          value={scope}
          onChange={changeScope}
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" value={SCOPE.ALL} />
          <Tab label="Notes" value={SCOPE.POSTS.NOTES} />
          <Tab label="Photos" value={SCOPE.POSTS.PHOTOS} />
          <Tab label="Articles" value={SCOPE.POSTS.ARTICLES} />
          <Tab label="Topics" value={SCOPE.POSTS.TOPICS} />
          <Tab label="Todos" value={SCOPE.POSTS.TODOS} />
          <Tab label="People" value={SCOPE.ACTORS.PEOPLE} />
          <Tab label="Groups" value={SCOPE.ACTORS.GROUPS} />
        </Tabs>
      </AppBar>
      <SearchBrowse
        key={`${sort}-${scope}-${searchRange}-${searchComments}`}
        queryParams={{
          q,
          sort,
          scope,
          searchRange,
          searchComments,
        }}
      />
    </React.Fragment>
  );
};

Search.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
