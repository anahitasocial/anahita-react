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

import i18n from '../../../languages';
import Player from '../../../components/Player';
import EntityBody from '../../../components/NodeBody';
import ActorType from '../../../proptypes/Actor';

const ActorBodyAbout = (props) => {
  const { actor } = props;
  const {
    body,
    websiteUrl,
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
      {websiteUrl &&
        <List>
          <ListItem
            button
            component="a"
            href={websiteUrl}
            target="_blank"
            /*
              nofollow because an arbitrary person-supplied link on a public
              profile is an SEO-spam magnet; noopener/noreferrer because
              target="_blank" otherwise hands the opened page a handle on this
              one. rel="me" is the Mastodon convention for a profile link and
              is what would let a site verify itself back to us later.
            */
            rel="me nofollow noopener noreferrer"
          >
            <ListItemIcon>
              <WebsiteIcon />
            </ListItemIcon>
            <ListItemText
              primary={i18n.t('actor:website')}
              secondary={
                <Typography
                  variant="body1"
                  noWrap
                >
                  {websiteUrl}
                </Typography>
              }
            />
          </ListItem>
        </List>}
    </Card>
  );
};

ActorBodyAbout.propTypes = {
  actor: ActorType.isRequired,
};

export default ActorBodyAbout;
