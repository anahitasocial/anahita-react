import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

import ActorAvatar from '../../../../components/actor/Avatar';
import ActorType from '../../../../proptypes/Actor';
import actions from '../../../../actions';

const ActorsSettingsAdminsAdd = (props) => {
  const {
    actor,
    addAdmin,
    namespace,
  } = props;

  const [keyword, setkeyword] = useState('');
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchList = (q) => {
    const path = `/${namespace}/${actor.id}/adminscandidates.json`;

    setIsFetching(true);

    axios.get(path, {
      params: {
        q,
      },
    })
      .then((response) => {
        const { data } = response.data;
        return setOptions(data);
      })
      .catch((err) => {
        return console.error(err);
      }).finally(() => {
        return setIsFetching(false);
      });
  };

  return (
    <Autocomplete
      id={`${namespace}-select-add`}
      open={isOpen}
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      onChange={(event, admin) => {
        addAdmin({ actor, admin });
      }}
      getOptionSelected={(option, value) => {
        return option.name === value.name;
      }}
      getOptionLabel={(option) => {
        return option.name;
      }}
      onInputChange={(event, q) => {
        fetchList(q);
        setkeyword(q);
      }}
      options={options}
      loading={isFetching}
      renderOption={(admin) => {
        return (
          <>
            <ListItemAvatar>
              <ActorAvatar
                actor={admin}
                size="small"
              />
            </ListItemAvatar>
            <ListItemText
              primary={admin.name}
            />
          </>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Add Admins"
            value={keyword}
            placeholder="Jane smith ..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
    />
  );
};

ActorsSettingsAdminsAdd.propTypes = {
  actor: ActorType.isRequired,
  addAdmin: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    return {
      actor,
      namespace,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addAdmin: (params) => {
        return dispatch(actions[namespace].settings.admins.add(params));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsAdminsAdd);
};
