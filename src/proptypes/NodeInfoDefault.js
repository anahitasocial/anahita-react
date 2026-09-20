// An empty NodeInfo document.
//
// Every nested object is present so a consumer can reach through
// usage.users.total or metadata.supportEmail without guarding each hop.
// The About tab distinguishes "not answered yet" from "answered with
// nothing" by holding null until the request settles, rather than by
// seeding with this and hoping the zeroes read as absence.
export default {
  version: '',
  software: {
    name: '',
    version: '',
    repository: '',
  },
  protocols: [],
  services: {
    inbound: [],
    outbound: [],
  },
  openRegistrations: false,
  usage: {
    users: {
      total: 0,
      activeMonth: 0,
      activeHalfyear: 0,
    },
    localPosts: 0,
  },
  metadata: {
    nodeName: '',
    nodeDescription: '',
    registrationMode: '',
    approvalRequired: false,
    invitationsAccepted: false,
    supportEmail: '',
    supportPhone: '',
    supportWebsite: '',
    termsOfServiceUrl: '',
    privacyPolicyUrl: '',
  },
};
