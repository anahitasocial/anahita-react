import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import { Medium as MEDIUM } from '../../../constants';
import MediumType from '../../../proptypes/Medium';

import utils from '../../../utils';
import i18n from '../../../languages';

const { BODY } = MEDIUM.FIELDS;
const { isPerson } = utils.node;

const ComposersNote = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      body,
    },
    medium,
    viewer,
    owner,
    isFetching,
  } = props;

  const placeholder = isPerson(owner) && owner.id !== viewer.id ? i18n.t('notes:composer.bodyPlaceholderPerson', {
    name: owner.name,
  }) : i18n.t('notes:composer.bodyPlaceholder');

  const canPrivatePost = isPerson(owner) && owner.id !== viewer.id;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card square>
        <CardContent>
          <TextField
            autoFocus
            name="body"
            value={medium.body}
            onChange={handleOnChange}
            error={body.error !== ''}
            helperText={body.error}
            multiline
            fullWidth
            margin="normal"
            variant="outlined"
            disabled={isFetching}
            inputProps={{
              maxLength: BODY.MAX_LENGTH,
            }}
            placeholder={placeholder}
            required
          />
          {canPrivatePost &&
            <FormControlLabel
              control={
                <Switch
                  name="is_private"
                  value
                  onChange={handleOnChange}
                />
              }
              label="Private"
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
            {!isFetching && i18n.t('actions:post')}
            {isFetching && <CircularProgress size={24} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ComposersNote.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  owner: ActorType.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  medium: MediumType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default ComposersNote;
