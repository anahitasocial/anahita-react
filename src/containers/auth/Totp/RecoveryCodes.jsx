import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import i18n from '../../../languages';

const useStyles = makeStyles((theme) => {
  return {
    list: {
      fontSize: 16,
      fontWeight: 600,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    textBlock: {
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(),
    },
  };
});

const TOTPRecoveryCodes = ({
  items: recoveryCodes = [],
}) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" className={classes.textBlock}>
        {i18n.t('auth:totp.recoveryCodes.cTitle')}
      </Typography>
      <Typography variant="body2" className={classes.textBlock}>
        {i18n.t('auth:totp.recoveryCodes.cDesc')}
      </Typography>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <List>
            {recoveryCodes.map((rCode, index) => {
              const key = `recoveryCode-left-${index}`;
              if (index % 2 === 0) {
                return (
                  <ListItem key={key}>
                    <ListItemText primary={rCode} />
                  </ListItem>
                );
              }

              return (<></>);
            })}
          </List>
        </Grid>
        <Grid item>
          <List>
            {recoveryCodes.map((rCode, index) => {
              const key = `recoveryCode-right-${index}`;
              if (index % 2 !== 0) {
                return (
                  <ListItem key={key}>
                    <ListItemText primary={rCode} />
                  </ListItem>
                );
              }

              return (<></>);
            })}
          </List>
        </Grid>
      </Grid>
      <Typography variant="body2" className={classes.textBlock}>
        {i18n.t('auth:totp.recoveryCodes.warning')}
      </Typography>
    </>
  );
};

TOTPRecoveryCodes.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
};

export default TOTPRecoveryCodes;
