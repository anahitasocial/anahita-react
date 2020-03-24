import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import ActorAvatar from '../actor/Avatar';
import CommentType from '../../proptypes/Comment';
import i18n from '../../languages';

const CommentForm = (props) => {
  const {
    disabled,
    handleFieldChange,
    onSubmit,
    handleCancel,
    comment,
  } = props;

  const { author, body } = comment;

  const [enable, setEnable] = useState(false);
  const [errors, setErrors] = useState({
    body: '',
  });

  const validateField = (field) => {
    const errs = {
      ...errors,
      [field.name]: field.validationMessage,
    };

    setErrors(errs);

    const isValid = Boolean(field.value && errs[field.name] === '');

    setEnable(isValid);
  };

  const onChange = (event) => {
    const { target } = event;

    setTimeout(() => {
      return validateField(target);
    }, 500);

    handleFieldChange(event);
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader
          avatar={
            <ActorAvatar
              actor={author}
              linked={Boolean(author.id)}
              size="small"
            />
          }
          title={
            <TextField
              id="comment-text-box"
              margin="normal"
              variant="outlined"
              placeholder={i18n.t('comments:comment.placeholder')}
              onChange={onChange}
              name="body"
              value={body}
              disabled={disabled}
              fullWidth
              autoFocus
              error={errors.body !== ''}
              helperText={errors.body}
              multiline
            />
          }
        />
        <CardActions>
          {comment.id > 0 &&
            <Button
              onClick={handleCancel}
              disabled={disabled}
              size="small"
              fullWidth
            >
              {i18n.t('actions:cancel')}
            </Button>
          }
          <Button
            type="submit"
            color="primary"
            disabled={disabled || !enable}
            variant="contained"
            size="small"
            fullWidth
          >
            {comment.id ? i18n.t('actions:update') : i18n.t('actions:post')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

CommentForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  disabled: PropTypes.bool,
  comment: CommentType.isRequired,
};

CommentForm.defaultProps = {
  handleCancel: null,
  disabled: false,
};

export default CommentForm;
