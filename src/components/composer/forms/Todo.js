import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import { Medium as MEDIUM } from '../../../constants';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

const {
  NAME,
  BODY,
} = MEDIUM.FIELDS;

const ComposersTodo = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields,
    medium,
    isFetching,
  } = props;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card square>
        <CardContent>
          {fields.name &&
            <TextField
              variant="outlined"
              name="name"
              value={medium.name}
              onChange={handleOnChange}
              label={i18n.t('todos:composer.title')}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={i18n.t('todos:composer.titlePlaceholder')}
              error={fields.name.error !== ''}
              helperText={fields.name.error}
              fullWidth
              margin="normal"
              disabled={isFetching}
              inputProps={{
                maxLength: NAME.MAX_LENGTH,
                minLength: NAME.MIN_LENGTH,
              }}
              required
            />}
          {fields.body &&
            <TextField
              variant="outlined"
              name="body"
              value={medium.body}
              onChange={handleOnChange}
              label={i18n.t('todos:composer.body')}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={i18n.t('todos:composer.bodyPlaceholder')}
              error={fields.body.error !== ''}
              helperText={fields.body.error}
              fullWidth
              multiline
              margin="normal"
              disabled={isFetching}
              inputProps={{
                maxLength: BODY.MAX_LENGTH,
              }}
              minRows={5}
              maxRows={10}
              required
            />}
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching}
            fullWidth
          >
            {!isFetching && i18n.t('actions:create')}
            {isFetching && <CircularProgress size={24} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ComposersTodo.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  medium: MediumType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default ComposersTodo;
