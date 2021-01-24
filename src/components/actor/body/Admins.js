import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ActorAvatar from '../../../components/actor/Avatar';
import ActorType from '../../../proptypes/Actor';
import utils from '../../../utils';

const { getURL } = utils.node;

const ActorBodyAdmins = (props) => {
  const {
    actor,
  } = props;

  const { administrators: admins } = actor;

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
            Admins
          </Typography>
        }
      />
      <List>
        {admins.map((admin) => {
          const key = `admin_${admin.id}`;
          const href = getURL(admin);
          return (
            <ListItem
              key={key}
              href={href}
              component="a"
              button
            >
              <ListItemAvatar>
                <ActorAvatar actor={admin} />
              </ListItemAvatar>
              <ListItemText
                primary={admin.name}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};

ActorBodyAdmins.propTypes = {
  actor: ActorType.isRequired,
};

export default ActorBodyAdmins;
