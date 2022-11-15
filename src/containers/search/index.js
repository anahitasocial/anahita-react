import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { geolocated } from 'react-geolocated';
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

import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

import SearchBrowse from './Browse';
import actions from '../../actions';
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
      width: '100%',
    },
    formControl: {
      width: '100%',
      marginTop: theme.spacing(3),
      // marginLeft: theme.spacing(1),
    },
    formControlLabel: {
      marginTop: theme.spacing(3),
    },
  };
});

const marks = [
  {
    value: 25,
    label: i18n.t('search:filterRadius', { radius: 25 }),
  },
  {
    value: 50,
    label: i18n.t('search:filterRadius', { radius: 50 }),
  },
  {
    value: 75,
    label: i18n.t('search:filterRadius', { radius: 75 }),
  },
  {
    value: 100,
    label: i18n.t('search:filterRadius', { radius: 100 }),
  },
  {
    value: 125,
    label: <AllInclusiveIcon />,
  },
];

const Search = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    location: {
      search,
    },
  } = props;

  const { q } = queryString.parse(search);
  let coordLong = 0.0;
  let coordLat = 0.0;

  const [scope, setScope] = useState(SCOPE.ALL);
  const [sort, setSort] = useState(SORTING.RELEVANT);
  const [searchComments, setSearchComments] = useState(false);
  const [searchRange, setSearchRange] = useState(125);

  const changeScope = (event, value) => {
    setScope(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t('search:cTitle'));
  }, []);

  if (
    isGeolocationAvailable &&
    isGeolocationEnabled &&
    coords
  ) {
    coordLong = coords.longitude;
    coordLat = coords.latitude;
  }

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        elevation={1}
      >
        <Toolbar>
          <FormGroup
            style={{
              width: '100%',
            }}
          >
            <FormControl
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="search-sort-label">
                {i18n.t('search:sort')}
              </InputLabel>
              <Select
                labelId="search-sort-label"
                id="search-sort-select"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                }}
                label={i18n.t('search:sort')}
              >
                <MenuItem value={SORTING.RELEVANT}>
                  {i18n.t('search:sortOptions.relevant')}
                </MenuItem>
                <MenuItem value={SORTING.RECENT}>
                  {i18n.t('search:sortOptions.recent')}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              className={classes.formControl}
            >
              <Slider
                value={searchRange}
                getAriaValueText={(value) => {
                  return `${value}km`;
                }}
                onChange={(event, value) => {
                  setSearchRange(value);
                }}
                aria-labelledby="search-range-slider"
                min={25}
                max={125}
                step={25}
                marks={marks}
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
              label={i18n.t('search:includeComments')}
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
          <Tab
            label={i18n.t('search:filterNodeTypes.all')}
            value={SCOPE.ALL}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.notes')}
            value={SCOPE.POSTS.NOTES}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.photos')}
            value={SCOPE.POSTS.PHOTOS}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.articles')}
            value={SCOPE.POSTS.ARTICLES}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.documents')}
            value={SCOPE.POSTS.DOCUMENTS}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.topics')}
            value={SCOPE.POSTS.TOPICS}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.posts.todos')}
            value={SCOPE.POSTS.TODOS}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.actors.people')}
            value={SCOPE.ACTORS.PEOPLE}
          />
          <Tab
            label={i18n.t('search:filterNodeTypes.actors.groups')}
            value={SCOPE.ACTORS.GROUPS}
          />
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (
          <SearchBrowse
            key={`${sort}-${scope}-${searchRange}-${searchComments}`}
            queryParams={{
              q,
              sort,
              scope,
              searchRange,
              searchComments,
              coordLong,
              coordLat,
            }}
          />
        );
      }, [
        q,
        sort,
        scope,
        searchRange,
        searchComments,
        coordLong,
        coordLat,
      ])}
    </>
  );
};

Search.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  coords: PropTypes.objectOf(PropTypes.shape({
    longitude: PropTypes.number,
    latitude: PropTypes.number,
  })),
  isGeolocationAvailable: PropTypes.bool.isRequired,
  isGeolocationEnabled: PropTypes.bool.isRequired,
};

Search.defaultProps = {
  coords: {
    longitude: 0.0,
    latitude: 0.0,
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

const mapStateToProps = () => {
  return {};
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search));
