import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';

const { NAME, BODY } = ACTOR.FIELDS;

const ActorInfoForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      name,
      body,
    },
    actor,
    isFetching,
  } = props;

  const enableSubmit = actor.id > 0 || (name.isValid && body.isValid);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <TextField
          name="name"
          value={actor.name}
          onChange={handleOnChange}
          label="Name"
          error={name.error !== ''}
          helperText={name.error}
          margin="normal"
          fullWidth
          inputProps={{
            maxLength: NAME.MAX_LENGTH,
            minLength: NAME.MIN_LENGTH,
          }}
          required
        />
        <TextField
          name="body"
          value={actor.body}
          onChange={handleOnChange}
          error={body.error !== ''}
          helperText={body.error}
          label="Description"
          margin="normal"
          fullWidth
          multiline
          inputProps={{
            maxLength: BODY.MAX_LENGTH,
            minLength: BODY.MIN_LENGTH,
          }}
          required
        />
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching || !enableSubmit}
          fullWidth
        >
          Save
        </Button>
      </CardActions>
    </form>
  );
};

ActorInfoForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default ActorInfoForm;
