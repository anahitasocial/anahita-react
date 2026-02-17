import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import ListItem from './ListItem';
import LocationsType from '../../../proptypes/Locations';
import NodeType from '../../../proptypes/Node';
import AddAction from '../../actions/tags/location/Add';

import actions from '../../../actions';
import { App as APP } from '../../../constants';

const useStyles = makeStyles((theme) => {
  return {
    list: {
      position: 'relative',
      overflow: 'auto',
      maxHeight: theme.spacing(50),
    },
  };
});

const { LIMIT } = APP.BROWSE;

const LocationsSelectorBrowse = (props) => {
  const classes = useStyles();
  const {
    browseList,
    resetList,
    noResultsCallback,
    items,
    node,
    queryFilters,
    handleClose,
    isFetching,
    cardProps,
    selectedLocations,
  } = props;

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  useEffect(() => {
    browseList({
      start: 0,
      limit: LIMIT,
      q: debouncedKeyword,
      ...queryFilters,
    });

    return () => {
      resetList();
    };
  }, [node.id, debouncedKeyword]);

  const handleOnChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setKeyword(value);
  };

  const selectedLocationIds = selectedLocations.map((location) => {
    return location.id;
  });

  if (keyword !== '' && !isFetching && items.allIds.length === 0 && noResultsCallback) {
    noResultsCallback(keyword);
  }

  return (
    <Card
      square
      {...cardProps}
    >
      <CardContent>
        <FormControl fullWidth>
          <TextField
            name="keyword"
            value={keyword}
            onChange={handleOnChange}
            variant="outlined"
            placeholder="Search location ..."
            fullWidth
            autoFocus
          />
        </FormControl>
      </CardContent>
      <List className={classes.list}>
        {items.allIds.map((itemId) => {
          const location = items.byId[itemId];
          const showAction = !selectedLocationIds.includes(location.id);
          return (
            <ListItem
              key={`location-graph-list-item-${itemId}`}
              location={location}
              actions={showAction &&
                <AddAction
                  tag={location}
                  node={node}
                  callback={handleClose}
                />}
            />
          );
        })}
      </List>
    </Card>
  );
};

LocationsSelectorBrowse.propTypes = {
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  queryFilters: PropTypes.object,
  items: LocationsType.isRequired,
  node: NodeType.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  noResultsCallback: PropTypes.func,
  cardProps: PropTypes.objectOf(PropTypes.any),
  selectedLocations: PropTypes.arrayOf(NodeType),
};

LocationsSelectorBrowse.defaultProps = {
  queryFilters: {
    q: '',
    nearby_latitude: 0,
    nearby_longitude: 0,
    locatable_id: 0,
  },
  noResultsCallback: null,
  cardProps: {},
  selectedLocations: [],
};

const mapStateToProps = (state) => {
  const {
    locations: items,
    error,
    isFetching,
    hasMore,
  } = state.locations;

  return {
    items,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseList: (params) => {
      return dispatch(actions.locations.browse(params));
    },
    resetList: () => {
      return dispatch(actions.locations.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationsSelectorBrowse);
