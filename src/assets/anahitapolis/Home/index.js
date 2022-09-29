import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { loadLinksPreset } from 'tsparticles-preset-links';

import actions from '../../../actions';
import i18n from '../../../languages';

import HeaderMeta from '../../../components/HeaderMeta';
import ContentCard from '../../../components/cards/home/Content';
import NodesCard from '../../../components/cards/home/Nodes';
import MapCard from '../../../components/cards/home/Map';
import Masonry from '../../../components/BreakpointMasonry';
import MediaCard from '../../../components/cards/home/Media';
import Hero from './Hero';
import content from './content';

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    tsparticles: {
      position: 'fixed',
      zIndex: -1,
    },
    canvas: {},
  };
});

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const Home = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { setAppTitle } = props;
  const cards = content();
  const { width: winWidth } = getWindowDimensions();

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);

    await loadLinksPreset(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  useEffect(() => {
    setAppTitle(i18n.t('home:cTitle'));
  }, [setAppTitle]);

  return (
    <>
      <HeaderMeta
        title="Knowledge Networking Platform and Framework"
        description="Anahita is a platform and framework for developing open science and knowledge-sharing applications on a social networking foundation."
      />
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className={classes.tsparticles}
        canvasClassName={classes.canvas}
        options={{
          preset: 'links',
          fullScreen: true,
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 120,
          particles: {
            number: {
              value: Math.ceil(winWidth / 8),
            },
            size: {
              value: 2,
            },
            move: {
              speed: 0.1,
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
      />
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <Masonry>
            {cards.map((card, cardIndex) => {
              const key = `card-${card.type}-${cardIndex}`;
              switch (card.type) {
                case 'content':
                  return (
                    <div key={key} className={classes.card}>
                      <ContentCard
                        title={card.title}
                        subheader={card.subheader}
                        content={card.content && card.content()}
                        actions={card.actions && card.actions()}
                      />
                    </div>
                  );
                case 'map':
                  return (
                    <div key={key} className={classes.card}>
                      <MapCard
                        title={card.title}
                        subheader={card.subheader}
                        showList={card.showList}
                        limit={card.limit}
                      />
                    </div>
                  );
                case 'media':
                  return (
                    <div key={key} className={classes.card}>
                      <MediaCard />
                    </div>
                  );
                case 'nodes':
                  return (
                    <div key={key} className={classes.card}>
                      <NodesCard
                        title={card.title}
                        subheader={card.subheader}
                        ids={card.ids}
                        namespace={card.namespace}
                        limit={card.limit}
                        sort={card.sort}
                      />
                    </div>
                  );
                case 'spacer':
                  return (<div key={key} />);
                default:
                  return (card.custom);
              }
            })}
          </Masonry>
        </Grid>
      </Grid>
    </>
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
