import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ListItem from './ListItem';
import Progress from '../../../components/Progress';
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
    error,
    isFetching,
    cardProps,
  } = props;

  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    browseList({
      start: 0,
      limit: LIMIT,
      layout: 'list_selector',
      taggable_id: node.id,
      ...queryFilters,
    });

    return () => {
      resetList();
    };
  }, [node.id, queryFilters]);

  const handleOnChange = (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    resetList();
    browseList({
      start: 0,
      limit: LIMIT,
      layout: 'list_selector',
      taggable_id: node.id,
      q: keyword,
    });
  };

  if (keyword !== '' && !isFetching && items.allIds.length === 0 && noResultsCallback) {
    noResultsCallback(keyword);
  }

  if (isFetching) {
    return (
      <Progress key="locations-progress" />
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Card
      square
      {...cardProps}
    >
      <CardContent>
        <form onSubmit={handleOnSubmit}>
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
        </form>
      </CardContent>
      <List className={classes.list}>
        {items.allIds.map((itemId) => {
          const location = items.byId[itemId];
          return (
            <ListItem
              key={`location-graph-list-item-${itemId}`}
              location={location}
              actions={
                <AddAction
                  tag={location}
                  node={node}
                  callback={handleClose}
                />
              }
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
