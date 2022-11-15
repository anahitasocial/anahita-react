import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TaggablesBrowse from './Browse';
import NodeType from '../../proptypes/Node';
import { App as APP } from '../../constants';
import i18n from '../../languages';

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
    <>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        variant="outlined"
      >
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label={i18n.t('commons:sortByOptions.top')}
            value={TOP}
          />
          <Tab
            label={i18n.t('commons:sortByOptions.recent')}
            value={RECENT}
          />
        </Tabs>
      </AppBar>
      {useMemo(() => {
        return (<TaggablesBrowse
          key={`taggable-tab-${tab}`}
          tag={tag}
          queryFilters={{
            q: '',
            sort: tab,
          }}
        />);
      }, [tab])}
    </>
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
