import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { alpha, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import i18n from '../../languages';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
  };
});

const SearchBox = (props) => {
  const classes = useStyles();
  const {
    location: {
      search,
    },
  } = props;

  const { q = '' } = queryString.parse(search);

  const [keyword, setKeyword] = useState(q);

  const handleOnChange = (event) => {
    const { value } = event.target;
    setKeyword(value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (keyword) {
      event.target.submit();
    }
  };

  return (
    <div className={classes.root}>
      <form
        onSubmit={handleOnSubmit}
        autoComplete="off"
        action="/search/"
        noValidate
      >
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder={i18n.t('search:boxPlaceholder')}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': i18n.t('search:cTitle') }}
          onChange={handleOnChange}
          name="q"
          value={keyword}
          required
        />
      </form>
    </div>
  );
};

SearchBox.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SearchBox;
