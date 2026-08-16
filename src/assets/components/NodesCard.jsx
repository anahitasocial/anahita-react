/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

import ActorAvatar from '../../components/ActorAvatar';
import Progress from '../../components/Progress';
import { App as APP } from '../../constants';
import icons from '../../components/AppIcons';

import api from '../../api';
import i18n from '../../languages';
import utils from '../../utils';

const { getURL, getNamespace, isActor } = utils.node;

const { SORTING } = APP.BROWSE;

// Shared empty default: a literal [] in the parameter list would be a
// new array on every render.
const NO_IDS = [];

const getAvatar = (node) => {
  if (isActor(node)) {
    return <ActorAvatar actor={node} />;
  }

  const namespace = getNamespace(node);

  if (namespace === 'hashtags') {
    return <Avatar>#</Avatar>;
  }

  return <Avatar>{icons[_.upperFirst(namespace)]}</Avatar>;
};

const getSubheader = (namespace) => {
  if (['actors', 'people', 'groups'].includes(namespace)) {
    return 'Actor Nodes';
  }

  if (['hashtags', 'locations'].includes(namespace)) {
    return 'Tag Nodes';
  }

  return '';
};

const HomeCardNodes = ({
  title = '',
  subheader = '',
  namespace,
  limit = 10,
  sort = SORTING.TOP,
  ids = NO_IDS,
}) => {
  const [items, setItems] = useState([]);

  // Depend on the ids by value, not by reference. `ids` is an array, so
  // it is a new object on every render — the `ids = []` default most of
  // all, since the default is evaluated fresh each time. Listing it
  // directly makes this effect re-run after its own setItems, which
  // re-renders, which allocates another array, which re-runs the
  // effect: an endless request loop for any card that omits `ids`.
  const idsKey = ids.join(',');

  useEffect(() => {
    api[namespace].browse({
      start: 0,
      limit,
      sort,
      ids,
    })
      .then((results) => {
        const { data } = results;
        setItems([...data.data]);
      })
      .catch((err) => {
        return console.error(err);
      });

    return () => {
      setItems([]);
    };
  }, [namespace, limit, sort, idsKey]);

  return (
    <Card component="section">
      <CardHeader
        title={
          <Typography variant="h6">
            {title || i18n.t(`${namespace}:cTitle`)}
          </Typography>
        }
        subheader={subheader || getSubheader(namespace)}
      />
      {items.length === 0 && <Progress />}
      <List>
        {items.map((item) => {
          const key = `${namespace}_${item.id}`;
          const href = getURL(item);
          const avatar = getAvatar(item);
          return (
            <ListItem
              key={key}
              href={href}
              component="a"
              button
            >
              <ListItemAvatar>
                {avatar}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography noWrap>
                    {item.name}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
      <CardActions>
        <Button
          fullWidth
          href={`/explore/${namespace}`}
          various="text"
        >
          {i18n.t('commons:viewAll')}
        </Button>
      </CardActions>
    </Card>
  );
};

HomeCardNodes.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  limit: PropTypes.number,
  sort: PropTypes.oneOf([
    SORTING.TOP,
    SORTING.RECENT,
  ]),
  ids: PropTypes.arrayOf(PropTypes.number),
};

export default HomeCardNodes;
