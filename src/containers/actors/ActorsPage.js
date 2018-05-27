import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';
import FollowAction from '../actions/FollowAction';

import {
  browseActors,
  resetActors,
} from '../../actions/actors';

import { Person as PERSON } from '../../constants';

import ActorCard from '../../components/cards/ActorCard';
import ActorAvatar from '../../components/ActorAvatar';
import ActorTitle from '../../components/ActorTitle';

const styles = theme => ({
  root: {
    width: '100%',
  },
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
    marginLeft: '48%',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: 10,
  },
});

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
    this.props.resetActors();
  }

  canFollow(actor) {
    const { viewer, isAuthenticated } = this.props;
    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  fetchActors() {
    const { disabledFilter, keywordFilter } = this.state;
    const {
      queryFilters,
      namespace,
    } = this.props;

    this.props.browseActors({
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

  render() {
    const {
      classes,
      actors,
      namespace,
    } = this.props;

    const hasMore = this.hasMore();

    return (
      <div className={classes.root}>
        {this.canAdd() &&
          <Button
            className={classes.addButton}
            variant="fab"
            color="secondary"
            aria-label="add"
            component={Link}
            to={`/${namespace}/add/`}
          >
            <AddIcon />
          </Button>
        }
        <Toolbar>
          <Typography
            variant="display1"
            color="inherit"
            className={classes.title}
          >
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchActors}
          hasMore={hasMore}
          loader={<CircularProgress key={0} className={classes.progress} />}
        >
          <StackGrid
            columnWidth={440}
            gutterWidth={20}
            gutterHeight={20}
          >
            {actors.allIds.map((actorId) => {
              const actor = actors.byId[actorId];
              const key = `actor_${actor.id}`;
              const coverSrc = actor.coverURL.medium && actor.coverURL.medium.url;
              const canFollow = this.canFollow(actor);
              return (
                <ActorCard
                  key={key}
                  actor={actor}
                  name={actor.name}
                  alias={actor.alias}
                  description={actor.body}
                  cardAvatar={<ActorAvatar actor={actor} linked />}
                  cardTitle={
                    <ActorTitle
                      actor={actor}
                      typographyProps={{
                          component: 'h2',
                          variant: 'title',
                          className: classes.actorTitle,
                      }}
                      linked
                    />}
                  cover={coverSrc}
                  profile={`/${namespace}/${actor.id}/`}
                  action={canFollow &&
                    <FollowAction actor={actor} />
                  }
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </div>
    );
  }
}

ActorsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  actors: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  offset: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  viewer: PropTypes.object.isRequired,
  queryFilters: PropTypes.object,
};

ActorsPage.defaultProps = {
  queryFilters: {},
  total: 0,
  limit: 20,
  offset: 0,
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
  } = state.actorsReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

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
      dispatch(browseActors(params, namespace));
    },
    resetActors: () => {
      dispatch(resetActors());
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsPage));
