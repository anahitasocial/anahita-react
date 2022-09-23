import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import RootRef from '@material-ui/core/RootRef';
import TextField from '@material-ui/core/TextField';

import { Medium as MEDIUM } from '../../../constants';
import MediumType from '../../../proptypes/Medium';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: '100%',
    },
    button: {
      padding: theme.spacing(3),
    },
  };
});

const {
  NAME,
  BODY,
} = MEDIUM.FIELDS;

const ComposersFile = (props) => {
  const classes = useStyles();

  const {
    handleOnChange,
    handleOnFileSelect,
    handleOnSubmit,
    supportedMimetypes,
    fields,
    medium,
    file,
    isFetching,
  } = props;

  const {
    // acceptedFiles,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: supportedMimetypes.join(','),
    onDrop: (files) => {
      handleOnFileSelect(files[0]);
    },
  });

  const { ref, ...rootProps } = getRootProps();

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card square>
        <CardContent>
          <RootRef rootRef={ref}>
            <Button
              {...rootProps}
              disabled={isFetching}
              fullWidth
              size="large"
              className={classes.button}
              variant="outlined"
              color="primary"
            >
              <input
                accept={supportedMimetypes.join(',')}
                style
                id="addFileAttachment"
                type="file"
                name="file"
                {...getInputProps()}
                required
              />
              {!file && 'Select or Drop a file here'}
              {file && file.name}
            </Button>
          </RootRef>
          {fields.name &&
            <TextField
              variant="outlined"
              name="name"
              value={medium.name}
              onChange={handleOnChange}
              label="Name"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Name this file ..."
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
              margin="normal"
              disabled={isFetching}
              inputProps={{
                maxLength: BODY.MAX_LENGTH,
              }}
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
            {!isFetching && 'Upload'}
            {isFetching && <CircularProgress size={24} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

ComposersFile.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnFileSelect: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  medium: MediumType.isRequired,
  file: PropTypes.objectOf(PropTypes.any),
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  supportedMimetypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ComposersFile.defaultProps = {
  file: null,
};

export default ComposersFile;
