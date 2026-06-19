import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroll-component';

import List from '@material-ui/core/List';

import Progress from '../../../components/Progress';
import NotificationItem from './ListItem';

import NotificationsType from '../../../proptypes/Notifications';

const NotificationsList = ({
  items,
  total,
  fetchList,
  handleEdit,
  handleDelete,
}) => {
  const hasMore = total > items.allIds.length;

  return (
    <List id="scrollableDiv">
      <InfiniteScroll
        dataLength={items.allIds.length}
        next={fetchList}
        hasMore={hasMore}
        loader={<Progress key="items-progress" />}
      >
        {items.allIds.map((itemId) => {
          const item = items.byId[itemId];
          return (
            <NotificationItem
              key={`node_list_item_${item.id}`}
              item={item}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          );
        })}
      </InfiniteScroll>
    </List>
  );
};

NotificationsList.propTypes = {
  items: NotificationsType.isRequired,
  total: PropTypes.number.isRequired,
  fetchList: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default NotificationsList;
