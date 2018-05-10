import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui/List';
import InfoIcon from 'material-ui-icons/Info';
import AccountIcon from 'material-ui-icons/Lock';
import PermissionsIcon from 'material-ui-icons/Settings';
import AppsIcon from 'material-ui-icons/Apps';
import ConnectIcon from 'material-ui-icons/Share';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';
import { Link } from 'react-router-dom';
import ActorSettingCard from '../cards/ActorSettingCard';

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  card: {
    margin: '64px auto',
  },
};

const ActorSettingsList = (props) => {
  const {
    classes,
    actor,
    namespace,
  } = props;

  return (
    <div className={classes.root}>
      <ActorSettingCard
        namespace={namespace}
        actor={actor}
      >
        <List>
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/info/`}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Info" />
          </ListItem>
          {namespace === 'people' &&
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/account/`}
          >
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
          }
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/permissions/`}
          >
            <ListItemIcon>
              <PermissionsIcon />
            </ListItemIcon>
            <ListItemText primary="Permissions" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/apps/`}
          >
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary="Apps" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/connect/`}
          >
            <ListItemIcon>
              <ConnectIcon />
            </ListItemIcon>
            <ListItemText primary="Connect" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to={`/${namespace}/${actor.id}/settings/deleteforever/`}
          >
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            <ListItemText primary="Delete Forever" />
          </ListItem>
        </List>
      </ActorSettingCard>
    </div>
  );
};

ActorSettingsList.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
};

export default withStyles(styles)(ActorSettingsList);
