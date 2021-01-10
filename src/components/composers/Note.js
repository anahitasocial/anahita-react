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

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import MediumType from '../../proptypes/Medium';

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

  const enableSubmit = body.isValid;
  const placeholder = (owner.id === viewer.id) ? `What's on your mind ${viewer.name}` : 'Share a note';

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
              maxLength: 280,
            }}
            placeholder={placeholder}
            required
          />
          {owner.id !== viewer.id &&
            <FormControlLabel
              control={
                <Switch
                  name="is_private"
                  value={1}
                  checked={medium.is_private === '1'}
                  onChange={handleOnChange}
                />
              }
              label="Private"
            />
          }
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching || !enableSubmit}
            fullWidth
          >
            {!isFetching && 'Post'}
            {isFetching && <CircularProgress />}
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
