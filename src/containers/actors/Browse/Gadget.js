import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Browse from './index';
import { Actor as ACTOR } from '../../../constants';
import PersonType from '../../../proptypes/Person';
import i18n from '../../../languages';

const { FILTER } = ACTOR;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const ActorsBrowseGadget = (props) => {
  const classes = useStyles();
  const {
    selectedTab,
    namespace,
    owner,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  const ActorsBrowse = Browse(namespace);

  return (
    <>
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
          <Tab
            label={i18n.t('commons:following')}
            value={FILTER.FOLLOWING}
          />
          <Tab
            label={i18n.t('commons:administering')}
            value={FILTER.ADMINISTERING}
          />
        </Tabs>
      </AppBar>
      <ActorsBrowse
        key={`actors-${tab}`}
        queryFilters={{
          oid: owner.id,
          filter: tab,
        }}
      />
    </>
  );
};

ActorsBrowseGadget.propTypes = {
  selectedTab: PropTypes.oneOf([
    FILTER.ADMINISTERING,
    FILTER.FOLLOWING,
  ]),
  namespace: PropTypes.string.isRequired,
  owner: PersonType.isRequired,
};

ActorsBrowseGadget.defaultProps = {
  selectedTab: FILTER.FOLLOWING,
};

export default ActorsBrowseGadget;
