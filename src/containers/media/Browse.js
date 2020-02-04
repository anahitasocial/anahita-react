import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withWidth from '@material-ui/core/withWidth';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';

import * as actions from '../../actions';
import i18n from '../../languages';

import MediumCard from './Card';
import PersonType from '../../proptypes/Person';
import Progress from '../../components/Progress';

import utils from '../utils';

const LIMIT = 20;

class MediaBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      keywordFilter: '',
      hasMore: true,
      media: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchMedia = this.fetchMedia.bind(this);

    const { setAppTitle, namespace } = props;
    setAppTitle(i18n.t(`${namespace}:cTitle`));
  }

  static getDerivedStateFromProps(nextProps) {
    const { media, hasMore } = nextProps;
    return { media, hasMore };
  }

  componentWillUnmount() {
    const { resetMedia } = this.props;
    resetMedia();
  }

  fetchMedia() {
    const { keywordFilter } = this.state;
    const {
      namespace,
      browseMedia,
      queryFilters,
    } = this.props;

    browseMedia({
      q: keywordFilter,
      start: this.offset,
      limit: LIMIT,
      ...queryFilters,
    }, namespace).then(() => {
      this.offset += LIMIT;
    });
  }

  render() {
    const {
      namespace,
      viewer,
      width,
    } = this.props;

    const { hasMore, media } = this.state;

    const columnWidth = utils.getColumnWidthPercentage(width);

    return (
      <InfiniteScroll
        loadMore={this.fetchMedia}
        hasMore={hasMore}
        loader={
          <Progress key={`${namespace}-progress`} />
        }
      >
        <StackGrid
          columnWidth={columnWidth}
          duration={50}
          gutterWidth={16}
          gutterHeight={16}
        >
          {media.allIds.map((mediumId) => {
            const medium = media.byId[mediumId];
            const key = `medium_${medium.id}`;
            return (
              <MediumCard
                key={key}
                medium={medium}
                viewer={viewer}
              />
            );
          })
          }
        </StackGrid>
      </InfiniteScroll>
    );
  }
}

MediaBrowse.propTypes = {
  browseMedia: PropTypes.func.isRequired,
  resetMedia: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  queryFilters: PropTypes.object,
  width: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

MediaBrowse.defaultProps = {
  queryFilters: {},
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      hasMore,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      media: state[namespace][namespace],
      namespace,
      error,
      hasMore,
      viewer,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseMedia: (params) => {
        return dispatch(actions[namespace].browse(params, namespace));
      },
      resetMedia: () => {
        return dispatch(actions[namespace].reset(namespace));
      },
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(withWidth()(MediaBrowse));
};
