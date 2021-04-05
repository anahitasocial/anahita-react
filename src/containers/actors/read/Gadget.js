import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Truncate from 'react-truncate';

import AddIcon from '@material-ui/icons/Add';

import ActorAvatar from '../../../components/actor/Avatar';
import PersonType from '../../../proptypes/Person';
import Progress from '../../../components/Progress';

import i18n from '../../../languages';
import utils from '../../../utils';
import permissions from '../../../permissions';
import * as api from '../../../api';

const { getURL } = utils.node;

const ActorsGadget = (props) => {
  const {
    admin,
    viewer,
    namespace,
  } = props;
  const [actors, setActors] = useState([]);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setWaiting(true);
    api.projects
      .browse({
        oid: admin.id,
        filter: 'administering',
        offset: 0,
        limit: 1000,
      })
      .then((results) => {
        const { data } = results.data;
        setActors(data);
        setWaiting(false);
        return true;
      }).catch((err) => {
        console.error(err);
        setWaiting(false);
      });
  }, [admin.id]);

  const canAdd = permissions.actor.canAdd(admin, namespace) && admin.id === viewer.id;

  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Typography
            variant="h3"
            style={{
              fontSize: 24,
            }}
          >
            {i18n.t(`${namespace}:mTitle`)}
          </Typography>
        }
      />
      {waiting && <Progress />}
      <List>
        {actors.map((actor) => {
          const key = `${namespace}_${actor.id}`;
          const href = getURL(actor);
          return (
            <ListItem
              key={key}
              href={href}
              component="a"
              button
            >
              <ListItemAvatar>
                <ActorAvatar actor={actor} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Truncate>
                    {actor.name}
                  </Truncate>
                }
                secondary={
                  <Truncate lines={3}>
                    {actor.body}
                  </Truncate>
                }
              />
            </ListItem>
          );
        })}
      </List>
      {canAdd &&
        <CardActions>
          <Button
            variant="outlined"
            fullWidth
            component="a"
            href="/projects/add/"
          >
            <AddIcon />
          </Button>
        </CardActions>
      }
    </Card>
  );
};

ActorsGadget.propTypes = {
  admin: PersonType.isRequired,
  viewer: PersonType.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default (namespace) => {
  return (props) => {
    return (<ActorsGadget namespace={namespace} {...props} />);
  };
};
