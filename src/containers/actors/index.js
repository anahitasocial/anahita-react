import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Browse from './browse';
import actions from '../../actions/app';
import { Actor as ACTOR } from '../../constants';
import PersonType from '../../proptypes/Person';
import i18n from '../../languages';

const { FILTER } = ACTOR;

const useStyles = makeStyles({
  root: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
});

const Actors = (props) => {
  const classes = useStyles();
  const {
    setAppTitle,
    selectedTab,
    namespace,
    owner,
  } = props;

  const [tab, setTab] = useState(selectedTab);

  const changeTab = (event, value) => {
    setTab(value);
  };

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }, []);

  const ActorsBrowse = Browse(namespace);

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
          <Tab label={i18n.t(`${namespace}:cTitle`)} value="" />
          <Tab label="Following" value={FILTER.FOLLOWING} />
          <Tab label="Administering" value={FILTER.ADMINISTERING} />
        </Tabs>
      </AppBar>
      <ActorsBrowse
        key={`actors-${tab}`}
        queryFilters={{
          oid: owner.id,
          filter: tab,
        }}
      />
    </React.Fragment>
  );
};

Actors.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOf([
    '',
    FILTER.ADMINISTERING,
    FILTER.FOLLOWING,
  ]),
  namespace: PropTypes.string.isRequired,
  owner: PersonType.isRequired,
};

Actors.defaultProps = {
  selectedTab: '',
};

const mapDispatchToProps = () => {
  return (dispatch) => {
    return {
      setAppTitle: (title) => {
        return dispatch(actions.setAppTitle(title));
      },
    };
  };
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      viewer: owner,
    } = state.session;

    return {
      namespace,
      owner,
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(),
  )(Actors);
};
