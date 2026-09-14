import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import DocumentIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme) => {
  return {
    // The text in a bounded, scrolling box rather than behind a link.
    //
    // A link is not a presentation. "It was on the screen they accepted from"
    // is a far better thing to be able to say than "they could have clicked
    // it", and it is also simply kinder to somebody who wants to read it.
    content: {
      maxHeight: 320,
      overflowY: 'auto',
      padding: theme.spacing(0, 2),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      '& a': {
        color: theme.palette.primary.main,
      },
    },
  };
});

const AgreementCard = ({
  title,
  subheader = '',
  body,
  actionLabel,
  onAccept,
  disabled = false,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <DocumentIcon />
          </Avatar>
        }
        title={<Typography variant="h6">{title}</Typography>}
        subheader={subheader}
      />
      <CardContent>
        <div className={classes.content}>
          {body}
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onAccept}
          disabled={disabled}
        >
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );
};

AgreementCard.propTypes = {
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  body: PropTypes.node.isRequired,
  actionLabel: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AgreementCard;
