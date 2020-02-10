import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = (theme) => {
  return {
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    appBar: {
      marginBottom: theme.spacing(2),
    },
  };
};

const SocialgraphTabs = (props) => {
  const {
    classes,
    followers,
    leaders,
    mutuals,
    blocked,
  } = props;

  const [value, setValue] = React.useState('followers');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.root}>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.appBar}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Socialgraph Tabs"
        >
          <Tab label="Followers" value="followers" id="socialgraph-tab-followers" />
          {leaders && <Tab label="Leaders" value="leaders" id="socialgraph-tab-leaders" />}
          {mutuals && <Tab label="Mutuals" value="mutuals" id="socialgraph-tab-mutuals" />}
          {blocked && <Tab label="Blocked" value="blocked" id="socialgraph-tab-blocked" />}
        </Tabs>
      </AppBar>
      {value === 'followers' && followers}
      {value === 'leaders' && leaders}
      {value === 'mutuals' && mutuals}
      {value === 'blocked' && blocked}
    </Box>
  );
};

SocialgraphTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  followers: PropTypes.node,
  leaders: PropTypes.node,
  mutuals: PropTypes.node,
  blocked: PropTypes.node,
};

SocialgraphTabs.defaultProps = {
  followers: null,
  leaders: null,
  mutuals: null,
  blocked: null,
};

export default withStyles(styles)(SocialgraphTabs);
