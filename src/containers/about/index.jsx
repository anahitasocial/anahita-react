import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeaderMeta from '../../components/HeaderMeta';
import Progress from '../../components/Progress';
import actions from '../../actions';
import api from '../../api';
import i18n from '../../languages';

import About from './About';

const SITE_NAME = process.env.REACT_APP_NAME;

// What this installation is, read from its own NodeInfo document.
//
// PUBLIC, and that is the point of it being here rather than in
// settings. Every value on the page already is: metadata, software and
// usage all come from /nodeinfo/2.1, which anybody can read
// unauthenticated, and the client's version and licence are compiled
// into the bundle every visitor downloads. Gating it hid nothing from
// a stranger and hid all of it from members.
//
// It also had the audience backwards. Registration mode, the terms, who
// to contact, how big the place is — that is a prospective member's
// checklist, and they are exactly the people who cannot reach a
// super-admin tab. Same reasoning that puts /support and /legal in the
// menu for everybody.
//
// Local state rather than redux. One document, read when the page
// opens, consumed by one component. The store does hold NodeInfo for
// the left menu, but this page wants it fresh on arrival and wants to
// distinguish "not answered yet" from "answered with nothing" — which
// the store's empty default cannot express.
const AboutPage = ({ setAppTitle }) => {
  // null is "not answered yet". Distinguishing that from an answered
  // request keeps the page from flashing an error before NodeInfo has
  // had a chance to reply.
  const [nodeInfo, setNodeInfo] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAppTitle(i18n.t('about:cTitle'));
  }, [setAppTitle]);

  useEffect(() => {
    let cancelled = false;

    api.nodeInfo.read()
      .then(({ data }) => {
        if (!cancelled) {
          setNodeInfo(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <HeaderMeta title={`${i18n.t('about:cTitle')} - ${SITE_NAME}`} />
      {!nodeInfo && !failed && <Progress />}
      {(nodeInfo || failed) &&
        <About
          nodeInfo={nodeInfo}
          failed={failed}
        />}
    </>
  );
};

AboutPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(AboutPage);
