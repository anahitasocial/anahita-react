import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';
import ActorsFormsMetadata from './Metadata';

const { NAME, BODY } = ACTOR.FIELDS;

const ActorFormsInfo = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields,
    actor,
    isFetching,
    enabled,
  } = props;

  const enableSubmit = actor.id > 0 || (fields.name.isValid && fields.body.isValid);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        {enabled}
        <TextField
          name="name"
          value={actor.name}
          onChange={handleOnChange}
          label={i18n.t('actor:name')}
          error={fields.name.error !== ''}
          helperText={fields.name.error}
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
          value={actor.body || ''}
          onChange={handleOnChange}
          error={fields.body.error !== ''}
          helperText={fields.body.error}
          label={i18n.t('actor:body')}
          margin="normal"
          fullWidth
          multiline
          inputProps={{
            maxLength: BODY.MAX_LENGTH,
            minLength: BODY.MIN_LENGTH,
          }}
          required
        />
        <ActorsFormsMetadata
          handleOnChange={handleOnChange}
          fields={fields}
          actor={actor}
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
          {actor.id ? i18n.t('actions:update') : i18n.t('actions:create')}
        </Button>
      </CardActions>
    </form>
  );
};

ActorFormsInfo.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
  isFetching: PropTypes.bool.isRequired,
  enabled: PropTypes.node,
};

ActorFormsInfo.defaultProps = {
  enabled: null,
};

export default ActorFormsInfo;
