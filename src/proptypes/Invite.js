import {
  shape,
  number,
  string,
} from 'prop-types';

import ImageUrls from './ImageUrls';

// One outstanding invitation.
//
// id is a STRING, not a number. auth-service formats the token id with
// strconv.FormatInt where every other entity sends it as a number.
// Typed honestly rather than corrected, because the accept flow reads
// it this way already and a coercion here would only move the surprise.
//
// No token. The secret is in the email that was sent and nowhere else —
// a list of pending invites has no business carrying links that let
// whoever opens it claim any of them.
//
// author is still sent, and is now always the viewer: the browse
// endpoint scopes on created_by. Kept on the shape because the
// response carries it, but the screen no longer renders it — the same
// name on every row is not information.
export default shape({
  id: string,
  recipientEmail: string,
  // pending, used, or expired.
  status: string,
  createdAt: string,
  author: shape({
    id: number,
    type: string,
    alias: string,
    name: string,
    avatarUrls: ImageUrls,
  }),
});
