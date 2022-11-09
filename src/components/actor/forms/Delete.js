import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';
import i18n from '../../../languages';

const { ALIAS } = ACTOR.FIELDS;

const ActorDeleteForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      alias,
    },
    actor,
    isFetching,
  } = props;

  const enableDelete = actor.alias === alias.value;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <TextField
          name="alias"
          onChange={handleOnChange}
          label="Alias"
          error={alias.error !== ''}
          helperText={alias.error}
          margin="normal"
          fullWidth
          inputProps={{
            maxLength: ALIAS.MAX_LENGTH,
            minLength: ALIAS.MIN_LENGTH,
          }}
          required
        />
        <FormHelperText>
          {i18n.t('actor:delete.prompts.challenge', {
            alias: actor.alias,
          })}
        </FormHelperText>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isFetching || !enableDelete}
          fullWidth
        >
          {isFetching ? i18n.t('actor:delete.prompts.inProgress') : i18n.t('actions:delete')}
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
};

export default ActorDeleteForm;
