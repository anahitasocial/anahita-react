import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import Masonry from '../../../components/BreakpointMasonry';
import MediaListItem from './ListItem';
import Progress from '../../../components/Progress';
import PersonType from '../../../proptypes/Person';
import MediaType from '../../../proptypes/Media';

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
  };
});

const MediaList = ({
  items,
  namespace,
  viewer,
  total,
  fetchList,
  handleView,
}) => {
  const classes = useStyles();
  const hasMore = total > items.allIds.length;

  return (
    <InfiniteScroll
      dataLength={items.allIds.length}
      next={fetchList}
      hasMore={hasMore}
      loader={<Progress key={`${namespace}-progress`} />}
    >
      <Masonry>
        {items.allIds.map((itemId) => {
          const node = items.byId[itemId];
          const key = `${namespace}_node_list_item${node.id}`;
          return (
            <div
              className={classes.card}
              key={key}
            >
              <MediaListItem
                medium={node}
                viewer={viewer}
                handleView={handleView}
              />
            </div>
          );
        })}
      </Masonry>
    </InfiniteScroll>
  );
};

MediaList.propTypes = {
  items: MediaType.isRequired,
  namespace: PropTypes.string.isRequired,
  viewer: PersonType.isRequired,
  total: PropTypes.number.isRequired,
  fetchList: PropTypes.func.isRequired,
  handleView: PropTypes.func.isRequired,
};

export default MediaList;
