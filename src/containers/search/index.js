import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

const Search = (props) => {
  const {
    location: {
      search,
    },
  } = props;

  const { q } = queryString.parse(search);

  return (
    <React.Fragment>
      Searching {q}
    </React.Fragment>
  );
};

Search.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Search;
