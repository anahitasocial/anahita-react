import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Documents from '../media/composer/Documents';
import Notes from '../media/composer/Notes';
import Photos from '../media/composer/Photos';

import i18n from '../../languages';
import appIcons from '../../components/app/Icons';
import ActorType from '../../proptypes/Actor';

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const apps = [
  // 'articles',
  'documents',
  'notes',
  'photos',
  // 'topics',
];

const Composers = (props) => {
  const classes = useStyles();
  const {
    selectedTab,
    owner,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  return (
    <React.Fragment>
      {tab === 'documents' && <Documents owner={owner} />}
      {tab === 'photos' && <Photos owner={owner} />}
      {tab === 'notes' && <Notes owner={owner} />}
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
          {apps.map((app) => {
            return (
              <Tab
                key={`composer-tab-${app}`}
                label={i18n.t(`apps:${app}`)}
                value={app}
                icon={appIcons[app]}
              />
            );
          })}
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
};

Composers.propTypes = {
  owner: ActorType.isRequired,
  selectedTab: PropTypes.oneOf(apps),
};

Composers.defaultProps = {
  selectedTab: 'notes',
};

export default Composers;
