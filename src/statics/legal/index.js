import privacyFile from './privacy.md';
import tosFile from './tos.md';

// The legal documents, and the version of each currently in force.
//
// WHEN YOU CHANGE A DOCUMENT, RAISE ITS VERSION HERE. That is the whole
// mechanism: on their next request, anybody whose accepted version is behind is
// sent to the agreements page — an existing member and somebody who joined a
// minute ago alike.
//
// Versions are compared NUMERICALLY, part by part (see utils/agreements), so:
//
//   1.0.0 -> 1.0.1   asks everybody again
//   1.0.0 -> 1.1.0   asks everybody again
//   1.1.0 -> 1.0.0   asks nobody — a rollback is not a new document
//
// Digits and dots only, up to three parts. The server refuses anything else,
// because "1.0-beta" or "v2" would compare as something nobody intended.
//
// The two are independent. Raise only the one whose text changed, or people are
// asked to accept a document they have already accepted.
//
// Forking the repository and editing these files is the intended way for an
// installation to make them its own.
export default {
  tos: {
    title: 'Terms of Service',
    file: tosFile,
    version: '1.0.0',
  },
  privacy: {
    title: 'Privacy Policy',
    file: privacyFile,
    version: '1.0.0',
  },
};
