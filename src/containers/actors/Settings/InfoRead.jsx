import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ActorType from '../../../proptypes/Actor';
import i18n from '../../../languages';

// An unset field shows a dash rather than an empty row: a blank ListItemText
// collapses to nothing, and a row that vanishes reads as "this field does not
// exist" instead of "you have not filled it in".
const EMPTY = '—';

// Read view of a group's information.
//
// Collapsed by default, matching the person Info card and the credential cards
// in the people settings — a settings page is read far more often than it is
// edited, and a form left permanently open invites accidental changes.
//
// Deliberately NOT shared with people/Settings/InfoRead: an actor has metadata
// where a person has pronouns and a usertype, and the only thing the two views
// have in common is their shape.
const InfoRead = ({
  actor,
  canAdmin,
  created,
  onEdit,
}) => {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            primary={i18n.t('actor:name')}
            secondary={actor.name || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('actor:body')}
            secondary={actor.body || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('actor:meta.website')}
            secondary={actor.website || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('actor:meta.contactUrl')}
            secondary={actor.contact_url || EMPTY}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={i18n.t('actor:meta.phone')}
            secondary={actor.phone || EMPTY}
          />
        </ListItem>

        {/* Administrator-only, and read-only here. The edit form carries a
            live switch for this; an interactive control in a view with no
            Save button on screen would let somebody toggle a group's access
            and watch nothing happen. */}
        {canAdmin &&
          <ListItem>
            <ListItemText
              primary={i18n.t('commons:enabled')}
              secondary={actor.enabled
                ? i18n.t('commons:enabled')
                : i18n.t('commons:disabled')}
            />
          </ListItem>}
      </List>

      {canAdmin &&
        <Typography variant="caption" display="block" align="center">
          {created}
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
  actor: ActorType.isRequired,
  canAdmin: PropTypes.bool.isRequired,
  created: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default InfoRead;
