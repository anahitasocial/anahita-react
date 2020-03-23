import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TaggablesBrowse from './Browse';
import NodeType from '../../proptypes/Node';
import { App as APP } from '../../constants';

const {
  SORTING: {
    TOP,
    RECENT,
  },
} = APP.BROWSE;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const TaggablesPanel = (props) => {
  const { sort, tag } = props;
  return (
    <TaggablesBrowse
      tag={tag}
      queryFilters={{
        q: '',
        sort,
      }}
    />
  );
};

TaggablesPanel.propTypes = {
  tag: NodeType.isRequired,
  sort: PropTypes.oneOf([
    TOP,
    RECENT,
  ]).isRequired,
};

const Taggables = (props) => {
  const classes = useStyles();
  const {
    selectedTab,
    tag,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        elevation={1}
      >
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Top" value={TOP} />
          <Tab label="Recent" value={RECENT} />
        </Tabs>
      </AppBar>
      {tab === TOP &&
        <TaggablesPanel
          tag={tag}
          sort={tab}
        />
      }
      {tab === RECENT &&
        <TaggablesPanel
          tag={tag}
          sort={tab}
        />
      }
    </React.Fragment>
  );
};

Taggables.propTypes = {
  tag: NodeType.isRequired,
  selectedTab: PropTypes.oneOf([
    TOP,
    RECENT,
  ]),
};

Taggables.defaultProps = {
  selectedTab: TOP,
};

export default Taggables;
