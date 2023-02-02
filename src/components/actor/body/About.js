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
    information: {
      website,
      contact_url: contactUrl,
      phone,
    },
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
        {website &&
          <ListItem
            button
            component="a"
            href={website}
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
                  {website}
                </Typography>
              }
            />
          </ListItem>}
        {contactUrl &&
          <ListItem
            button
            component="a"
            href={contactUrl}
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
                  {contactUrl}
                </Typography>
              }
            />
          </ListItem>}
        {phone &&
          <ListItem
            button
            component="a"
            href={`tel:${phone}`}
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
                  {phone}
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
