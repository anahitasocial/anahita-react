import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import { Medium as MEDIUM } from '../../../constants';
import MediumType from '../../../proptypes/Medium';
import i18n from '../../../languages';

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

const ComposersFile = React.forwardRef((props, ref) => {
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
    namespace,
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

  const { ...rootProps } = getRootProps();

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card square>
        <CardContent>
          <Button
            {...rootProps}
            ref={ref}
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
            {!file && i18n.t(`${namespace}:composer.select`)}
            {file && file.name}
          </Button>
          {fields.name &&
            <TextField
              variant="outlined"
              name="name"
              value={medium.name}
              onChange={handleOnChange}
              label={i18n.t(`${namespace}:composer.name`)}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={i18n.t(`${namespace}:composer.namePlaceholder`)}
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
              label={i18n.t(`${namespace}:composer.body`)}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={i18n.t(`${namespace}:composer.bodyPlaceholder`)}
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
            {!isFetching && i18n.t('actions:post')}
            {isFetching && <CircularProgress size={24} />}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
});

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
  namespace: PropTypes.string.isRequired,
};

ComposersFile.defaultProps = {
  file: null,
};

export default ComposersFile;
