import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import WebsiteIcon from '@material-ui/icons/Web';
import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';

import i18n from '../../../languages';
import Player from '../../Player';
import EntityBody from '../../EntityBody';
import ActorType from '../../../proptypes/Actor';

const ActorBodyAbout = (props) => {
  const { actor } = props;
  const {
    body,
    information = {},
  } = actor;

  return (
    <Card component="section">
      <CardHeader
        title={
          <Typography
            variant="h3"
            style={{
              fontSize: 24,
            }}
          >
            {i18n.t('actor:about')}
          </Typography>
        }
      />
      {body &&
        <>
          <Player text={body} />
          <CardContent>
            <EntityBody contentFilter>
              {body}
            </EntityBody>
          </CardContent>
        </>}
      <List>
        {information && information.website &&
          <ListItem
            button
            component="a"
            href={information.website}
            target="_blank"
          >
            <ListItemIcon>
              <WebsiteIcon />
            </ListItemIcon>
            <ListItemText
              primary={i18n.t('actor:meta.website')}
              secondary={
                <Typography
                  variant="body1"
                  noWrap
                >
                  {information.website}
                </Typography>
              }
            />
          </ListItem>}
        {information && information.contact_url &&
          <ListItem
            button
            component="a"
            href={information.contact_url}
            target="_blank"
          >
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText
              primary={i18n.t('actor:meta.contact')}
              secondary={
                <Typography
                  variant="body1"
                  noWrap
                >
                  {information.contact_url}
                </Typography>
              }
            />
          </ListItem>}
        {information && information.phone &&
          <ListItem
            button
            component="a"
            href={`tel:${information.phone}`}
            target="_blank"
          >
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText
              primary={i18n.t('actor:meta.phone')}
              secondary={
                <Typography
                  variant="body1"
                  noWrap
                >
                  {information.phone}
                </Typography>
              }
            />
          </ListItem>}
      </List>
    </Card>
  );
};

ActorBodyAbout.propTypes = {
  actor: ActorType.isRequired,
};

export default ActorBodyAbout;
