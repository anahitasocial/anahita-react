import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import StoryCard from '../../components/cards/StoryCard';
import ActorAvatar from '../../components/ActorAvatar';
import ActorTitle from '../../components/ActorTitle';

const styles = (theme) => {
  return {
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
};

class StoryContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    const {
      story,
      classes,
    } = this.props;

    const subject = story.subject || {
      id: null,
      name: 'unknown',
      givenName: '?',
      familyName: '?',
      objectType: 'com.people.person',
      imageURL: {},
    };

    const portrait = story.object &&
    story.object.imageURL &&
    story.object.imageURL.medium &&
    story.object.imageURL.medium.url;

    const cover = story.object &&
    story.object.coverURL &&
    story.object.coverURL.medium &&
    story.object.coverURL.medium.url;

    const title = story.object && story.object.name;
    const body = story.object && story.object.body;

    return (
      <StoryCard
        author={
          <ActorTitle
            actor={subject}
            typographyProps={{
                component: 'h4',
                variant: 'title',
                className: classes.authorName,
            }}
            linked={Boolean(subject.id)}
          />
        }
        authorAvatar={
          <ActorAvatar
            actor={subject}
            linked={Boolean(subject.id)}
          />
        }
        owner={
          <ActorTitle
            actor={story.owner}
            typographyProps={{
                component: 'h5',
                variant: 'subheading',
                className: classes.ownerName,
            }}
            linked
          />
        }
        title={title}
        description={body}
        portrait={portrait}
        cover={cover}
        path={`/stories/${story.id}/`}
      />
    );
  }
}

StoryContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryContainer);
