import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';

const { NAME, BODY } = ACTOR.FIELDS;

const ActorInfoForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    formTitle,
    fields: {
      name,
      body,
    },
    actor,
    isFetching,
    dismissPath,
  } = props;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        {formTitle &&
          <Typography
            variant="h6"
            color="primary"
            style={{
              textTransform: 'capitalize',
            }}
          >
            {formTitle}
          </Typography>
        }
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
        {dismissPath &&
        <Button
          component={Link}
          to={dismissPath}
        >
          Dismiss
        </Button>
        }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isFetching}
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
  formTitle: PropTypes.string,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dismissPath: PropTypes.string,
};

ActorInfoForm.defaultProps = {
  formTitle: '',
  dismissPath: '',
};

export default ActorInfoForm;
