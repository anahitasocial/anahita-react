import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';

import appActions from '../../actions/app';
import actions from '../../actions/actor';
import i18n from '../../languages';
import permissions from '../../permissions/actor';
import containersUtils from '../utils';

import PersonType from '../../proptypes/Person';
import ActorsType from '../../proptypes/Actors';
import ActorsCard from './Card';

const styles = (theme) => {
  return {
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    actorTitle: {
      fontSize: 16,
    },
    actorAlias: {
      fontSize: 12,
    },
    progress: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: 10,
    },
  };
};

const LIMIT = 20;

class ActorsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      disabledFilter: false,
      keywordFilter: '',
      hasMore: true,
      actors: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchActors = this.fetchActors.bind(this);
  }

  componentWillMount() {
    const { setAppTitle, namespace } = this.props;
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  componentWillReceiveProps(nextProps) {
    const { actors, hasMore } = nextProps;
    this.setState({ actors, hasMore });
  }

  componentWillUnmount() {
    const { resetActors } = this.props;
    resetActors();
  }

  fetchActors() {
    const { disabledFilter, keywordFilter } = this.state;
    const {
      queryFilters,
      namespace,
      browseActors,
    } = this.props;

    browseActors({
      q: keywordFilter,
      disabled: disabledFilter,
      start: this.offset,
      limit: LIMIT,
      ...queryFilters,
    }, namespace).then(() => {
      this.offset += LIMIT;
    });
  }

  render() {
    const {
      classes,
      namespace,
      viewer,
      width,
    } = this.props;

    const { hasMore, actors } = this.state;

    const columnWidth = containersUtils.getColumnWidthPercentage(width);
    const canAdd = permissions.canAdd(viewer);

    return (
      <React.Fragment>
        {canAdd &&
          <Fab
            aria-label="Add"
            color="secondary"
            className={classes.addButton}
            component={Link}
            to={`/${namespace}/add/`}
          >
            <AddIcon />
          </Fab>
        }
        <InfiniteScroll
          loadMore={this.fetchActors}
          hasMore={hasMore}
          loader={
            <Grid
              container
              justify="center"
              alignItems="center"
              key="circular-progress"
            >
              <Grid item>
                <CircularProgress className={classes.progress} />
              </Grid>
            </Grid>
          }
        >
          <StackGrid
            columnWidth={columnWidth}
            duration={50}
            gutterWidth={16}
            gutterHeight={16}
          >
            {actors.allIds.map((actorId) => {
              const actor = actors.byId[actorId];
              const key = `actor_${actor.id}`;
              return (
                <ActorsCard
                  key={key}
                  actor={actor}
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

ActorsBrowse.propTypes = {
  classes: PropTypes.object.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

ActorsBrowse.defaultProps = {
  queryFilters: {},
};

const mapStateToProps = (state) => {
  const {
    actors,
    actorIds,
    error,
    offset,
    limit,
    hasMore,
  } = state.actors;

  const {
    viewer,
  } = state.auth;

  return {
    actors,
    actorIds,
    error,
    offset,
    limit,
    hasMore,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseActors: (params, namespace) => {
      return dispatch(actions.browse(params, namespace));
    },
    resetActors: () => {
      return dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      return dispatch(appActions.setAppTitle(title));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(ActorsBrowse)));
