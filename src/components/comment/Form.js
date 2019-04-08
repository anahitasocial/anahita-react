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
    handleAdd,
    comment,
    bodyError,
    bodyHelperText,
  } = props;

  const { body } = comment;

  return (
    <Card square>
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
          autoFocus
          error={bodyError}
          helperText={bodyHelperText}
          multiline
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={handleAdd}
          color="primary"
          disabled={disabled}
          variant="contained"
          size="small"
        >
          {i18n.t('comments:comment.reply')}
        </Button>
      </CardActions>
    </Card>
  );
};

CommentForm.propTypes = {
  handleFieldChange: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  comment: CommentType.isRequired,
  bodyError: PropTypes.bool.isRequired,
  bodyHelperText: PropTypes.string,
};

CommentForm.defaultProps = {
  disabled: true,
  bodyHelperText: '',
};

export default CommentForm;
