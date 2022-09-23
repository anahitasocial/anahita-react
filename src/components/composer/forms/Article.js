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

const {
  NAME,
  BODY,
  EXCERPT,
} = MEDIUM.FIELDS;

const ComposersArticle = (props) => {
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
              label="Title"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Article's title ..."
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
              label="Description"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Write a description ..."
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
          {fields.excerpt &&
            <TextField
              variant="outlined"
              name="excerpt"
              value={medium.excerpt}
              onChange={handleOnChange}
              label="Excerpt"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Write a excerpt ..."
              error={fields.excerpt.error !== ''}
              helperText={fields.excerpt.error}
              fullWidth
              multiline
              margin="normal"
              disabled={isFetching}
              inputProps={{
                maxLength: EXCERPT.MAX_LENGTH,
              }}
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
            {!isFetching && 'Post'}
            {isFetching && <CircularProgress size={24} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ComposersArticle.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  medium: MediumType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default ComposersArticle;
