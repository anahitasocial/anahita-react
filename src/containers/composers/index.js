import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import inflector from 'inflector-js';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import _ from 'lodash';

import MediaComposer from '../media/composer';

import i18n from '../../languages';
import appIcons from '../../components/app/Icons';
import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import utils from '../../utils';

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
  tab: {
    fontSize: 12,
  },
});

const Composers = ({
  actor,
  viewer,
}) => {
  const classes = useStyles();
  const composers = utils.node.getComposers(actor, viewer);
  const [tab, setTab] = useState(composers[0]);

  const changeTab = (event, value) => {
    setTab(value);
  };

  if (composers.length === 0) {
    return (<></>);
  }

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        className={classes.root}
        variant="outlined"
      >
        <MediaComposer
          actor={actor}
          namespace={inflector.pluralize(tab)}
        />
        <Tabs
          value={tab}
          onChange={changeTab}
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
        >
          {composers.map((composer) => {
            return (
              <Tab
                key={`composer-tab-${composer}`}
                label={i18n.t(`apps:${composer}`)}
                value={composer}
                icon={appIcons[_.upperFirst(composer)]}
                className={classes.tab}
              />
            );
          })}
        </Tabs>
      </AppBar>
    </>
  );
};

Composers.propTypes = {
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
};

export default Composers;
