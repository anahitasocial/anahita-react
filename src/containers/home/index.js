import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import GithubIcon from '@material-ui/icons/GitHub';

import actions from '../../actions';
import i18n from '../../languages';

import NodesGadget from './Nodes';
import Hero from './Hero';
import LocationsMap from './LocationsMap';
import HeaderMeta from '../../components/HeaderMeta';

const Home = (props) => {
  const { setAppTitle } = props;

  useEffect(() => {
    setAppTitle(i18n.t('home:cTitle'));
  }, [setAppTitle]);

  return (
    <React.Fragment>
      <HeaderMeta title={i18n.t('home:cTitle')} />
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            fullWidth
            variant="contained"
            size="large"
          >
            <Button
              href="https://github.com/anahitasocial/anahita"
              target="_blank"
              color="primary"
              startIcon={<GithubIcon />}
            >
              Anahita
            </Button>
            <Button
              href="https://github.com/anahitasocial/anahita-react"
              target="_blank"
              color="primary"
              startIcon={<GithubIcon />}
            >
              Anahita React
            </Button>
            <Button
              href="/pages/join/"
              color="default"
            >
              Join the Tribe
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} md={4}>
          <NodesGadget namespace="people" />
        </Grid>
        <Grid item xs={12} md={4}>
          <NodesGadget namespace="groups" />
        </Grid>
        <Grid item xs={12} md={4}>
          <NodesGadget namespace="hashtags" />
        </Grid>
        <Grid item xs={12} md={4}>
          <NodesGadget namespace="locations" />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocationsMap />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Home.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
