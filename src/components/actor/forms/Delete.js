import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';

const { ALIAS } = ACTOR.FIELDS;

const ActorDeleteForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      alias,
    },
    actor,
    canDelete,
    isFetching,
  } = props;

  const enableDelete = actor.alias === alias.value && canDelete;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <Typography
          variant="h6"
          color="primary"
        >
          Delete Forever!
        </Typography>
        <TextField
          name="alias"
          onChange={handleOnChange}
          label={`Type the exact alias: "${actor.alias}"`}
          error={alias.error !== ''}
          helperText={alias.error}
          margin="normal"
          fullWidth
          disabled={!canDelete}
          inputProps={{
            maxLength: ALIAS.MAX_LENGTH,
            minLength: ALIAS.MIN_LENGTH,
          }}
          required
        />
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isFetching || !enableDelete}
          fullWidth
        >
          {isFetching ? 'Deleting in progress ...' : 'Delete'}
        </Button>
      </CardActions>
    </form>
  );
};

ActorDeleteForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  canDelete: PropTypes.bool.isRequired,
};

export default ActorDeleteForm;
