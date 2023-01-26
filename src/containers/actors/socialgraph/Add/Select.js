import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { singularize } from 'inflection';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import ActorAvatar from '../../../../components/actor/Avatar';
import ActorType from '../../../../proptypes/Actor';
import api from '../../../../api';
import utils from '../../../../utils';
import i18n from '../../../../languages';
import { App as APP } from '../../../../constants';
import actions from '../../../../actions';

const { getNamespace } = utils.node;
const { LIMIT } = APP.BROWSE;

const ActorsSocialgraphAddSelect = (props) => {
  const {
    actor,
    alertError,
    alertSuccess,
  } = props;
  const namespace = getNamespace(actor);
  const addfollowersApi = api[namespace][singularize(namespace)].addfollowers;

  const [isFetching, setIsFetching] = useState(false);
  const [people, setPeople] = useState([]);
  const [followers, setFollowers] = useState([]);

  const fetchList = (q) => {
    setIsFetching(true);
    addfollowersApi.browse({
      start: 0,
      limit: LIMIT,
      actor,
      q,
    }).then((resp) => {
      const { data } = resp.data;
      setPeople(data);
    }).then(() => {
      setIsFetching(false);
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleAdd = () => {
    followers.forEach((follower) => {
      addfollowersApi.add({ actor, follower })
        .then(() => {
          alertSuccess(i18n.t('prompts:added.success'));
        }).catch((err) => {
          console.error(err);
          alertError(i18n.t('prompts:added.error'));
        });
    });
    setFollowers([]);
  };

  return (
    <Card square>
      <CardContent>
        <Autocomplete
          multiple
          fullWidth
          value={followers}
          id={`${namespace}-select-followers-to-add`}
          onChange={(event, options) => {
            setFollowers(options);
          }}
          getOptionSelected={(option, value) => {
            return option.id === value.id;
          }}
          getOptionLabel={(option) => {
            return option.name;
          }}
          onInputChange={(event, q) => {
            fetchList(q);
          }}
          options={people}
          loading={isFetching}
          renderOption={(follower) => {
            return (
              <>
                <ListItemAvatar>
                  <ActorAvatar
                    actor={follower}
                    size="small"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={follower.name}
                />
              </>
            );
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Add follower ..."
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
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          color="primary"
          disabled={isFetching || followers.length === 0}
          variant="contained"
          size="small"
          fullWidth
          onClick={handleAdd}
        >
          {i18n.t('actions:add')}
        </Button>
      </CardActions>
    </Card>
  );
};

ActorsSocialgraphAddSelect.propTypes = {
  actor: ActorType.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertSuccess: (msg) => {
      dispatch(actions.app.alert.success(msg));
    },
    alertError: (msg) => {
      dispatch(actions.app.alert.error(msg));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsSocialgraphAddSelect);
