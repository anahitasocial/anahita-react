import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Particles from 'react-particles-js';

import GithubIcon from '@material-ui/icons/GitHub';

import actions from '../../actions';
import i18n from '../../languages';

import ContentCard from './Cards/Content';
import NodesCard from './Cards/Nodes';
import MediaCard from './Cards/Media';
import Hero from './Hero';
import MapCard from './Cards/LocationsMap';
import HeaderMeta from '../../components/HeaderMeta';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const Home = (props) => {
  const theme = useTheme();
  const { setAppTitle } = props;

  const { width: winWidth } = getWindowDimensions();

  useEffect(() => {
    setAppTitle(i18n.t('home:cTitle'));
  }, [setAppTitle]);

  return (
    <React.Fragment>
      <HeaderMeta title={i18n.t('home:cTitle')} />
      <Particles
        params={{
          particles: {
            number: {
              value: Math.ceil(winWidth / 8),
            },
            size: {
              value: 2,
            },
            move: {
              speed: 1,
            },
            lineLinked: {
              color: theme.palette.primary.main,
            },
            shape: {
              stroke: {
                color: theme.palette.primary.main,
              },
            },
          },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'transparent',
          zIndex: -10,
        }}
      />
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            fullWidth
            variant="contained"
          >
            <Button
              href="https://github.com/anahitasocial/anahita"
              target="_blank"
              color="primary"
              startIcon={<GithubIcon />}
            >
              Server
            </Button>
            <Button
              href="https://github.com/anahitasocial/anahita-react"
              target="_blank"
              color="primary"
              startIcon={<GithubIcon />}
            >
              Client
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Overview"
            body={
              <React.Fragment>
                Anahita is a platform and framework for developing open
                science and knowledge sharing applications on a social
                networking foundation.
              </React.Fragment>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Concepts"
            body={
              <React.Fragment>
                Anahita provides the essential nodes and graphs that you need
                for most of your projects. You can also build your own custom
                apps with custom nodes and graphs to further extend your platform.
              </React.Fragment>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Graph Architecture"
            body={
              <React.Fragment>
                Anahita’s native framework provides a graph architecture and
                necessary design patterns that you need for developing
                social apps that work seamlessly with each other.
                Unlike conventional web applications, Anahita stores
                app’s data as a network of interconnected nodes and graphs
                which makes it ready to be used for real-time analysis.
              </React.Fragment>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="RAD Framework"
            body={
              <React.Fragment>
                <Typography variant="body1">
                  We have developed Anahita using open source technologies that are
                  globally accessible to developers such as the LAMP stack and Javascript.
                </Typography>
                <ol>
                  <li>MVC rapid app development framework specialized for building social apps.</li>
                  <li>Fully customizable theme and user interfaces.</li>
                  <li>Extendable by social apps and components.</li>
                  <li>
                    RESTful and JSON APIs (ideal to use Anahita as a back-end
                    for mobile apps).
                  </li>
                </ol>
              </React.Fragment>
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <NodesCard namespace="people" />
        </Grid>
        <Grid item xs={12} md={6}>
          <NodesCard namespace="groups" />
        </Grid>
        <Grid item xs={12} md={4}>
          <NodesCard namespace="locations" />
        </Grid>
        <Grid item xs={12} md={8}>
          <MapCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <NodesCard namespace="hashtags" />
        </Grid>
        <Grid item xs={12} md={6}>
          <MediaCard />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Tribe Support"
            body={
              <React.Fragment>
                Join the Anahita tribe and then post your questions
                on the <Link href="/groups/107732-tribe-support/">Tribe Support</Link> group
                to get help from the members for free.
              </React.Fragment>
            }
            actions={
              <Button
                href="/pages/join"
                fullWidth
                variant="contained"
                color="primary"
              >
                Get Tribe Support
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Paid Support"
            body={
              <React.Fragment>
                Send an inquiry to the company who develops and maintains Anahita.
              </React.Fragment>
            }
            actions={
              <Button
                href="https://www.rmdstudio.com/contact"
                target="_blank"
                fullWidth
              >
                Get Paid Support
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ContentCard
            title="Credits"
            body={
              <React.Fragment>
                Anahita is developed and maintained by <strong>rmd Studio</strong>.
              </React.Fragment>
            }
            actions={
              <Button
                href="https://www.rmdstudio.com"
                target="_blank"
                fullWidth
              >
                Visit Website
              </Button>
            }
          />
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
