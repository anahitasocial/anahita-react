import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import MediumType from '../../../proptypes/Medium';
import { Medium as MEDIUM } from '../../../constants';

const {
  NAME,
  BODY,
} = MEDIUM.FIELDS;

const MediumFormEdit = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    handleCancel,
    fields: {
      name,
      body,
    },
    medium,
    isFetching,
  } = props;

  const enableSubmit = medium.id > 0 || (name.isValid && body.isValid);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        <TextField
          name="name"
          value={medium.name}
          onChange={handleOnChange}
          label="Title"
          error={name.error !== ''}
          helperText={name.error}
          autoFocus
          fullWidth
          margin="normal"
          disabled={isFetching}
          inputProps={{
            maxLength: NAME.MAX_LENGTH,
            minLength: NAME.MIN_LENGTH,
          }}
          required
        />
        <TextField
          name="body"
          value={medium.body}
          onChange={handleOnChange}
          label="Description"
          error={body.error !== ''}
          helperText={body.error}
          multiline
          fullWidth
          margin="normal"
          disabled={isFetching}
          inputProps={{
            maxLength: BODY.MAX_LENGTH,
          }}
          required
        />
      </CardContent>
      <CardActions>
        <Button
          disabled={isFetching}
          fullWidth
          onClick={handleCancel}
        >
          Cancel
        </Button>
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

MediumFormEdit.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  medium: MediumType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default MediumFormEdit;
