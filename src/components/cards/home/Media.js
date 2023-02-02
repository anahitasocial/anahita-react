import React from 'react';

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

import { Link } from 'react-router-dom';

import DocumentsIcon from '@material-ui/icons/PictureAsPdf';
import NotesIcon from '@material-ui/icons/Note';
import PhotosIcon from '@material-ui/icons/Photo';
import TopicsIcon from '@material-ui/icons/QuestionAnswer';
import ArticlesIcon from '@material-ui/icons/LibraryBooks';

import i18n from '../../../languages';

const HomeCardMedia = () => {
  return (
    <Card component="section">
      <CardHeader
        title={
          <Typography variant="h6">
            {i18n.t('commons:posts')}
          </Typography>
        }
        subheader="Media nodes"
      />
      <List>
        <ListItem
          button
          component={Link}
          to="/explore/notes/"
        >
          <ListItemAvatar>
            <Avatar>
              <NotesIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={i18n.t('notes:cTitle')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/explore/photos/"
        >
          <ListItemAvatar>
            <Avatar>
              <PhotosIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={i18n.t('photos:cTitle')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/explore/topics/"
        >
          <ListItemAvatar>
            <Avatar>
              <TopicsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={i18n.t('topics:cTitle')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/explore/articles/"
        >
          <ListItemAvatar>
            <Avatar>
              <ArticlesIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={i18n.t('articles:cTitle')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/explore/documents/"
        >
          <ListItemAvatar>
            <Avatar>
              <DocumentsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={i18n.t('documents:cTitle')} />
        </ListItem>
      </List>
      <CardActions>
        <Button
          fullWidth
          href="/explore/notes"
          various="text"
        >
          {i18n.t('commons:viewAll')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default HomeCardMedia;
