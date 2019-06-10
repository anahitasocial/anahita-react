import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import CommentType from '../../proptypes/Comment';
import i18n from '../../languages';

const CommentForm = (props) => {
  const {
    disabled,
    handleFieldChange,
    handleSave,
    handleCancel,
    comment,
    bodyError,
    bodyHelperText,
    autoFocus,
  } = props;

  const { body } = comment;

  return (
    <Card>
      <CardContent>
        <TextField
          id="comment-text-box"
          margin="normal"
          variant="outlined"
          placeholder={i18n.t('comments:comment.placeholder')}
          onChange={handleFieldChange}
          name="body"
          value={body}
          disabled={disabled}
          fullWidth
          autoFocus={autoFocus}
          error={bodyError}
          helperText={bodyHelperText}
          multiline
        />
      </CardContent>
      <CardActions>
        {comment.id > 0 &&
          <Button
            onClick={handleCancel}
            disabled={disabled}
            size="small"
          >
            {i18n.t('actions:cancel')}
          </Button>
        }
        <Button
          onClick={handleSave}
          color="primary"
          disabled={disabled}
          variant="contained"
          size="small"
        >
          {comment.id ? i18n.t('actions:update') : i18n.t('actions:post')}
        </Button>
      </CardActions>
    </Card>
  );
};

CommentForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  disabled: PropTypes.bool,
  comment: CommentType.isRequired,
  bodyError: PropTypes.bool.isRequired,
  bodyHelperText: PropTypes.string,
  autoFocus: PropTypes.bool,
};

CommentForm.defaultProps = {
  disabled: false,
  bodyHelperText: '',
  autoFocus: false,
  handleCancel: null,
};

export default CommentForm;
