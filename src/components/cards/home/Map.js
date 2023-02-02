/* eslint-disable react/no-unused-prop-types */
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

import AnahitaMap from '../../Map';
import Progress from '../../Progress';
import { App as APP } from '../../../constants';
import icons from '../../app/Icons';
import api from '../../../api';
import utils from '../../../utils';
import i18n from '../../../languages';

const { getURL } = utils.node;
const { SORTING } = APP.BROWSE;

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeCardMap = (params) => {
  const {
    title,
    subheader,
    showList,
    sort,
    limit,
    ids,
  } = params;

  const [items, setItems] = useState([]);

  useEffect(() => {
    api.locations.browse({
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
  }, []);

  return (
    <Card component="section">
      <CardHeader
        title={
          <Typography variant="h6">
            {title}
          </Typography>
        }
        subheader={subheader}
      />
      {items.length === 0 && <Progress />}
      {items.length > 0 &&
        <AnahitaMap
          locations={items}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          height={295}
        />}
      {showList &&
        <List>
          {items.map((item) => {
            const key = `locations_${item.id}`;
            const href = getURL(item);
            return (
              <ListItem
                key={key}
                href={href}
                component="a"
                button
              >
                <ListItemAvatar>
                  <Avatar>
                    {icons.Locations}
                  </Avatar>
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
        </List>}
      <CardActions>
        <Button
          fullWidth
          href="/explore/locations/"
          various="text"
        >
          {i18n.t('commons:viewAll')}
        </Button>
      </CardActions>
    </Card>
  );
};

HomeCardMap.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  limit: PropTypes.number,
  sort: PropTypes.oneOf([
    SORTING.TOP,
    SORTING.RECENT,
  ]),
  ids: PropTypes.arrayOf(PropTypes.number),
  showList: PropTypes.bool,
};

HomeCardMap.defaultProps = {
  title: 'Map',
  subheader: '',
  limit: 10,
  sort: SORTING.TOP,
  ids: [],
  showList: false,
};

export default HomeCardMap;
