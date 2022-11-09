import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';
import i18n from '../../../languages';

const { METADATA } = ACTOR.FIELDS;

const ActorFormsMetadata = (props) => {
  const {
    handleOnChange,
    fields,
    actor,
  } = props;

  return (
    <>
      <TextField
        name="website"
        type="url"
        value={actor.website || ''}
        onChange={handleOnChange}
        label={i18n.t('actor:meta.website')}
        placeholder="https://www.example.com"
        error={fields.website.error !== ''}
        helperText={fields.website.error}
        fullWidth
        margin="normal"
        inputProps={{
          maxLength: METADATA.MAX_LENGTH,
        }}
      />
      <TextField
        name="contact_url"
        type="url"
        value={actor.contact_url || ''}
        onChange={handleOnChange}
        label={i18n.t('actor:meta.contactUrl')}
        placeholder="https://www.example.com/contact"
        error={fields.contact_url.error !== ''}
        helperText={fields.contact_url.error}
        fullWidth
        margin="normal"
        inputProps={{
          maxLength: METADATA.MAX_LENGTH,
        }}
      />
      <TextField
        name="phone"
        type="tel"
        placeholder="000-000-0000"
        value={actor.phone || ''}
        onChange={handleOnChange}
        label={i18n.t('actor:meta.phone')}
        error={fields.phone.error !== ''}
        helperText={fields.phone.error}
        fullWidth
        margin="normal"
        inputProps={{
          maxLength: METADATA.MAX_LENGTH,
          pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
        }}
      />
    </>
  );
};

ActorFormsMetadata.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
};

export default ActorFormsMetadata;
