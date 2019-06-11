import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import InfiniteScroll from 'react-infinite-scroller';
import StackGrid from 'react-stack-grid';

import taggableActions from '../../actions/taggable';
import NodeType from '../../proptypes/Node';
import NodesType from '../../proptypes/Nodes';

import CommentCard from '../../components/cards/Comment';
import ActorsCard from '../actors/Card';
import MediaCard from '../media/Card';

import utils from '../../utils';
import containersUtils from '../utils';

const LIMIT = 20;

class TaggablesBrowse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taggables: {
        allIds: [],
        byId: {},
      },
      error: '',
      hasMore: true,
      sort: props.sorting,
    };

    this.offset = 0;
    this.fetchList = this.fetchList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      taggables,
      error,
      hasMore,
    } = nextProps;

    this.setState({
      taggables,
      error,
      hasMore,
    });
  }

  componentWillUnmount() {
    const { resetTaggables } = this.props;
    resetTaggables();
  }

  fetchList() {
    const { sort } = this.state;
    const { browseTaggables, tag } = this.props;

    browseTaggables({
      tag,
      sort,
      start: this.offset,
      limit: LIMIT,
    });

    this.offset += LIMIT;
  }

  render() {
    const {
      taggables,
      // isFetching,
      error,
      hasMore,
    } = this.state;

    const {
      width,
    } = this.props;

    const columnWidth = containersUtils.getColumnWidthPercentage(width);

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    return (
      <InfiniteScroll
        loadMore={this.fetchList}
        hasMore={hasMore}
        useWindow
        loader={
          <Grid
            container
            justify="center"
            alignItems="center"
            key="taggables-progress"
          >
            <Grid item>
              <CircularProgress
                style={{
                  margin: '16px 0',
                }}
              />
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
          {taggables.allIds.map((nodeId) => {
              const taggable = taggables.byId[nodeId];
              const key = `taggable_${taggable.id}`;
              return (
                <React.Fragment key={key}>
                  {utils.isActor(taggable) &&
                    <ActorsCard actor={taggable} />
                  }
                  {utils.isMedium(taggable) &&
                    <MediaCard medium={taggable} />
                  }
                  {utils.isComment(taggable) &&
                    <CommentCard
                      comment={taggable}
                    />
                  }
                </React.Fragment>
              );
            })
          }
        </StackGrid>
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    taggables,
    error,
    hasMore,
  } = state.taggables;

  return {
    taggables,
    error,
    hasMore,
  };
};

TaggablesBrowse.propTypes = {
  resetTaggables: PropTypes.func.isRequired,
  browseTaggables: PropTypes.func.isRequired,
  tag: NodeType.isRequired,
  sorting: PropTypes.oneOf(['top', 'recent']),
  taggables: NodesType.isRequired,
  error: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired,
};

TaggablesBrowse.defaultProps = {
  sorting: 'top',
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseTaggables: (params) => {
      return dispatch(taggableActions.browse(params));
    },
    resetTaggables: () => {
      return dispatch(taggableActions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(TaggablesBrowse));
