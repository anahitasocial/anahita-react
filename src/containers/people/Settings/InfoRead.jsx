import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import PersonType from '../../../proptypes/Person';
import { Person as PERSON } from '../../../constants';
import i18n from '../../../languages';

const { GENDER } = PERSON.FIELDS;

// Pronouns are stored as a gender value; the form offers three radio options
// and this is the read-side of the same mapping. Anything else — an empty
// value, or 'other', which the form cannot set — falls through to the dash.
const PRONOUN_KEYS = {
  [GENDER.FEMALE]: 'feminine',
  [GENDER.MALE]: 'masculine',
  [GENDER.NEUTRAL]: 'nonbinary',
};

// An unset field renders as a dash rather than an empty row. A blank
// ListItemText collapses to nothing and the row silently disappears, which
// reads as "this field does not exist" instead of "you have not filled it in".
const EMPTY = '—';

// Read view of the profile fields.
//
// Collapsed by default, matching the email, username and password cards it now
// sits beside in the Account section: a settings page is read far more often
// than edited, and a form left permanently open invites accidental changes.
const InfoRead = ({
  person,
  canAdmin,
  joinedDate,
  onEdit,
}) => {
  const name = [person.givenName, person.familyName]
    .filter((part) => {
      return Boolean(part);
    })
    .join(' ');

  const pronounKey = PRONOUN_KEYS[person.gender];

  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            primary={i18n.t('people:person.givenName')}
            secondary={name || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('people:person.body')}
            secondary={person.body || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('people:person.pronouns')}
            secondary={pronounKey
              ? i18n.t(`people:person.pronounOptions.${pronounKey}`)
              : EMPTY}
          />
        </ListItem>

        {/* Administrator-only, and read-only here. The edit form carries a
            live switch for these; showing an interactive control in a view
            whose Save button is not on screen would let somebody toggle an
            account's access and watch nothing happen. */}
        {canAdmin &&
          <ListItem>
            <ListItemText
              primary={i18n.t('people:person.usertype')}
              secondary={i18n.t(`people:person.usertypeOptions.${person.usertype}`)}
            />
          </ListItem>}
        {canAdmin &&
          <ListItem>
            <ListItemText
              primary={i18n.t('commons:enabled')}
              secondary={person.enabled
                ? i18n.t('commons:enabled')
                : i18n.t('commons:disabled')}
            />
          </ListItem>}
      </List>

      {canAdmin &&
        <Typography variant="caption" display="block" align="center">
          {i18n.t('people:person.joinedDate', { date: joinedDate })}
        </Typography>}

      <CardActions>
        <Button
          onClick={onEdit}
          color="primary"
          variant="outlined"
          fullWidth
        >
          {i18n.t('actions:edit')}
        </Button>
      </CardActions>
    </>
  );
};

InfoRead.propTypes = {
  person: PersonType.isRequired,
  canAdmin: PropTypes.bool.isRequired,
  joinedDate: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default InfoRead;
