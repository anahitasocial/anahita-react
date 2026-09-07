export default {
  about: 'About',
  name: 'Name',
  alias: 'Alias',
  website: 'Website',
  body: 'Description',
  unknown: 'Unknown',
  delete: {
    // The card said nothing about what deletion does, whether it is
    // reversible, or when it takes effect — it offered one text field and a
    // red button. These strings are the disclosure.
    prompts: {
      challenge: 'Type the exact alias: {{ alias }}',
      inProgress: 'Deleting in progress ...',
    },
    errors: {
      generic: 'Could not delete this profile. Please try again.',
      forbidden: 'You do not have permission to delete this profile.',
    },
  },
  access: {
    title: 'Access Alert',
    content: 'This profile will be publicly visible. Would you like to proceed?',
    labels: {
      whoCanSee: 'Who can see this profile?',
      othersCanRequestToFollow: 'Others can request to follow',
      whoCanAddFollowers: 'Who can can add followers?',
    },
  },
};
