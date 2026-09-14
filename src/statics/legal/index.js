import privacyFile from './privacy.md';
import tosFile from './tos.md';

// The legal documents, and where to read them.
//
// NO VERSION HERE, deliberately. The version in force is auth-service's
// TOS_VERSION and PRIVACY_VERSION, published through NodeInfo.
//
// A version in this file would be a second answer to "which terms are in
// force", and it had already drifted: this said 1.0.0 while the server said
// 1.0. The acceptance check compares what somebody accepted against what is
// current, so two sources that disagree mark every member as out of date for
// ever — and the record of what they agreed to has to be written by the server,
// not claimed by the page they agreed on.
//
// To change the text: edit the markdown, then raise the matching version in
// auth-service. Forking the repository and editing these two files is the
// intended way for an installation to make them its own.
export default {
  tos: {
    title: 'Terms of Service',
    file: tosFile,
  },
  privacy: {
    title: 'Privacy Policy',
    file: privacyFile,
  },
};
