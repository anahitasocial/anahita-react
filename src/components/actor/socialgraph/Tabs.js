import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import i18n from '../../../languages';

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
    selectedTab,
  } = props;

  const [value, setValue] = React.useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.root}>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.appBar}
        variant="outlined"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Socialgraph Tabs"
        >
          <Tab label={i18n.t('socialgraph:followers')} value="followers" id="socialgraph-tab-followers" />
          {leaders && <Tab label={i18n.t('socialgraph:leaders')} value="leaders" id="socialgraph-tab-leaders" />}
          {mutuals && <Tab label={i18n.t('socialgraph:mutuals')} value="mutuals" id="socialgraph-tab-mutuals" />}
          {blocked && <Tab label={i18n.t('socialgraph:blocked')} value="blocked" id="socialgraph-tab-blocked" />}
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
  selectedTab: PropTypes.oneOf(['followers', 'leaders', 'mutuals', 'blocked']),
};

SocialgraphTabs.defaultProps = {
  followers: null,
  leaders: null,
  mutuals: null,
  blocked: null,
  selectedTab: 'followers',
};

export default withStyles(styles)(SocialgraphTabs);
