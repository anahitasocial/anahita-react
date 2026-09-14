import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import agreementsUtil from '../utils/agreements';

// Sends a signed-in person to /agreements when either legal document has moved
// ahead of the version they accepted.
//
// Wraps the WHOLE route table rather than living in AuthenticatedRoute. The
// home route renders the dashboard for a signed-in viewer without passing
// through AuthenticatedRoute at all, so a gate there would miss the page most
// people land on straight after signing in.
//
// Existing members and people who joined a minute ago are treated the same: the
// only question is whether the version in statics/legal is ahead of theirs.
//
// A GATE ON THE INTERFACE, NOT ON THE API. It decides what somebody sees, and
// the tokens they hold are unchanged. That is the design as chosen.

// Paths reachable while something is outstanding.
//
// The agreements page itself, or this would loop. The legal documents, so
// somebody can read what they are being asked to accept in full before
// accepting it. Support, so a person who cannot get past this page can still
// ask for help. And the OAuth callback, which has to finish writing the session
// before there is a viewer to check at all.
const ALWAYS_REACHABLE = [
  '/agreements',
  '/legal',
  '/support',
  '/oauth/callback',
];

const isReachable = (pathname) => {
  return ALWAYS_REACHABLE.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

const AgreementsGate = ({ children }) => {
  const location = useLocation();

  // Three selectors rather than one returning an object. An object literal is
  // a new reference on every store update, so the gate would re-render on
  // every unrelated change anywhere in the app — including each keystroke in a
  // form it wraps.
  const viewer = useSelector((state) => { return state.session.viewer; });
  const isAuthenticated = useSelector((state) => { return state.session.isAuthenticated; });
  const isResolved = useSelector((state) => { return state.session.isResolved; });

  // Nothing is decided until the session has been READ, not merely restored
  // from the cache. A cached viewer from before an acceptance would otherwise
  // bounce somebody who has already agreed, for one render, on every reload.
  if (!isResolved || !isAuthenticated) {
    return children;
  }

  if (agreementsUtil.hasOutdatedTerms(viewer) && !isReachable(location.pathname)) {
    return <Navigate to="/agreements" replace />;
  }

  return children;
};

AgreementsGate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AgreementsGate;
