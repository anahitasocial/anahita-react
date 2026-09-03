import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';

// One entry in a settings section.
//
// The stacked items are a mix: Password, Email, Username, Passkeys, Two-factor
// and Access each render their own Card, while Sign-in activity, Info and
// Delete are bare forms and lists. Stacking them raw would put titled cards
// next to untitled flush content.
//
// So this wraps only the bare ones. The alternative was giving each of those
// three components its own Card, but they are used from outside this page and
// that would spend regressions elsewhere on a change that is purely visual
// here.
//
// Box rather than a Fragment for the spacing: the cards that arrive already
// wrapped have no margin of their own, so the gap between stacked items has to
// come from this level or the section reads as one undivided slab.
const SettingsItem = ({
  bare,
  title,
  children,
}) => {
  return (
    <Box mb={2}>
      {/* Card + header + divider + child, and deliberately NO CardContent.
          The bare items are not uniform underneath: InfoForm and Forms/Delete
          bring their own CardContent AND CardActions, so an extra CardContent
          here would double their padding and nest the action row inside the
          body; Authlogs renders a list of its own cards. Ending at the divider
          reproduces exactly how ActorSettingCard used to host all three, so
          they render as before and only gain a title of their own. */}
      {bare &&
        <Card>
          <CardHeader title={title} />
          <Divider />
          {children}
        </Card>}
      {!bare && children}
    </Box>
  );
};

SettingsItem.propTypes = {
  // Whether the child needs a Card supplied. See sections.js, which records
  // this per item alongside the item itself.
  bare: PropTypes.bool.isRequired,
  // Only read when bare — a child that brings its own Card brings its own
  // heading with it.
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default SettingsItem;
