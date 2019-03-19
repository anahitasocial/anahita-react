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
import Link from 'react-router-dom/Link';
import FollowAction from '../actions/Follow';

import appActions from '../../actions/app';
import actions from '../../actions/actor';
import i18n from '../../languages';
import permissions from '../../permissions/actor';

import PersonType from '../../proptypes/Person';
import ActorsListType from '../../proptypes/Actors';
import ActorCard from '../../components/cards/Actor';

const styles = (theme) => {
  return {
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    actorTitle: {
      fontSize: 16,
    },
    actorAlias: {
      fontSize: 12,
    },
    progress: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
    addButton: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 3,
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

  getColumnWidth() {
    let columnWidth = '100%';

    switch (this.props.width) {
      case 'md': {
        columnWidth = '50%';
        break;
      }
      case 'lg': {
        columnWidth = '33.33%';
        break;
      }
      case 'xl': {
        columnWidth = '25%';
        break;
      }
      case 'xs':
      case 'sm':
      default: {
        break;
      }
    }

    return columnWidth;
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
    }, namespace);

    this.offset += LIMIT;
  }

  render() {
    const {
      classes,
      namespace,
      isAuthenticated,
      viewer,
    } = this.props;

    const { hasMore, actors } = this.state;

    const columnWidth = this.getColumnWidth();
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
              key="actors-progress"
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
              const canFollow = permissions.canFollow(isAuthenticated, viewer, actor);
              return (
                <ActorCard
                  key={key}
                  actor={actor}
                  action={canFollow &&
                    <FollowAction
                      actor={actor}
                    />
                  }
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
  isAuthenticated: PropTypes.bool.isRequired,
  actors: ActorsListType.isRequired,
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
    isAuthenticated,
    viewer,
  } = state.auth;

  return {
    actors,
    actorIds,
    error,
    offset,
    limit,
    hasMore,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseActors: (params, namespace) => {
      dispatch(actions.browse(params, namespace));
    },
    resetActors: () => {
      dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(ActorsBrowse)));
