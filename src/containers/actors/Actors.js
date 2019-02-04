import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';
import FollowAction from '../actions/FollowAction';

import actions from '../../actions/actors';

import { Person as PERSON } from '../../constants';
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

class ActorsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      disabledFilter: false,
      keywordFilter: '',
    };

    this.offset = 0;
    this.fetchActors = this.fetchActors.bind(this);
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

  hasMore() {
    const { total, actors } = this.props;
    return !this.offset || actors.allIds.length < total;
  }

  canAdd() {
    const { viewer } = this.props;

    if ([
      PERSON.TYPE.SUPER_ADMIN,
      PERSON.TYPE.ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    return false;
  }

  canFollow(actor) {
    const { viewer, isAuthenticated } = this.props;
    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  render() {
    const {
      classes,
      actors,
      namespace,
    } = this.props;

    const hasMore = this.hasMore();
    const columnWidth = this.getColumnWidth();

    return (
      <React.Fragment>
        {this.canAdd() &&
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
        <Toolbar>
          <Typography
            variant="h2"
            color="inherit"
            className={classes.title}
          >
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchActors}
          hasMore={hasMore}
          loader={
            <Grid container justify="center">
              <Grid item alignItems="center">
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
              const canFollow = this.canFollow(actor);
              return (
                <ActorCard
                  key={key}
                  actor={actor}
                  action={canFollow &&
                    <FollowAction actor={actor} />
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

ActorsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  actors: ActorsListType.isRequired,
  namespace: PropTypes.string.isRequired,
  total: PropTypes.number,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
};

ActorsPage.defaultProps = {
  queryFilters: {},
  total: 0,
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    actors,
    actorIds,
    error,
    offset,
    limit,
    total,
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
    total,
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
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(ActorsPage)));
