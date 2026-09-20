import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

// The header a browse view opens with: what you are looking at, and the one
// thing you can add to it.
//
// Header only, with the list stacked underneath rather than inside — the same
// reason ActorSetting gives: every row below is already a card, and wrapping
// them would draw a border around a column of borders.
//
// The action is a bare +. It sits beside a title that names the entity, which
// is the case shortened button labels rest on, and the words it would have
// carried go to the tooltip and the accessible name instead. A screen reader
// reaching the button hears "Create group", not "Add" with no object, and the
// header stays one line wide on a phone.
//
// No action renders when `actionTo` is empty, which is how a viewer who may
// not add one sees no +. That is a rendering hint and nothing more: the route
// behind it does its own check, so a stale answer here costs a refusal, never
// a way in.
const BrowseHeader = ({
  icon,
  title,
  actionTo = '',
  actionLabel = '',
}) => {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar>
            {icon}
          </Avatar>
        }
        titleTypographyProps={{ variant: 'h5' }}
        title={title}
        action={actionTo &&
          <Tooltip title={actionLabel}>
            <IconButton
              color="primary"
              component={Link}
              to={actionTo}
              aria-label={actionLabel}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>}
      />
    </Card>
  );
};

BrowseHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  actionTo: PropTypes.string,
  actionLabel: PropTypes.string,
};

export default BrowseHeader;
