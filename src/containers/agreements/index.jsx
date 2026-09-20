import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AgreementCard from './AgreementCard';
import ViewerType from '../../proptypes/Viewer';
import actions from '../../actions';
import api from '../../api';
import i18n from '../../languages';
import legal from '../../statics/legal';
import agreementsUtil from '../../utils/agreements';

// Where somebody is sent when they have not accepted the current version of the
// Terms of Service or the Privacy Policy.
//
// Existing members and people who joined a minute ago land here the same way:
// the check is "is the version in statics/legal ahead of what you accepted", and
// nothing about how long you have been a member changes the answer.
//
// ONE CARD PER OUTSTANDING DOCUMENT, each accepted on its own. Raising only the
// privacy version asks only about the privacy policy — a document somebody has
// already accepted is shown as accepted rather than asked for again.

const useDocument = (file) => {
  const [text, setText] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch(file)
      .then((response) => { return response.text(); })
      .then((body) => { if (!cancelled) setText(body); })
      .catch(() => { if (!cancelled) setText(i18n.t('legal:unavailable')); });

    return () => { cancelled = true; };
  }, [file]);

  return text;
};

const Agreements = ({
  viewer,
  refreshSession,
  alertError,
}) => {
  const navigate = useNavigate();
  const tosText = useDocument(legal.tos.file);
  const privacyText = useDocument(legal.privacy.file);

  // Which document is being submitted, so its button can disable while the
  // request is out and a double click does not record it twice.
  const [pending, setPending] = useState('');

  const tosOutdated = agreementsUtil.hasOutdatedTos(viewer);
  const privacyOutdated = agreementsUtil.hasOutdatedPrivacy(viewer);
  const allCurrent = !tosOutdated && !privacyOutdated;

  // Accept, then refresh the session.
  //
  // The refresh is what clears the gate. AuthenticatedRoute reads the viewer
  // from the session, and until the session carries the new version it will
  // keep sending this person back here — so a successful acceptance that did
  // not re-read would look, from the outside, like a button that does nothing.
  const accept = (document, edit, version) => {
    setPending(document);

    edit(version)
      .then(() => { return refreshSession(); })
      .catch(() => { alertError(i18n.t('agreements:prompts.error')); })
      .then(() => { setPending(''); });
  };

  return (
    <Container maxWidth="md">
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            {i18n.t('agreements:cTitle')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {allCurrent
              ? i18n.t('agreements:allCurrent')
              : i18n.t('agreements:intro')}
          </Typography>
        </Grid>

        <Grid item>
          {tosOutdated
            ? (
              <AgreementCard
                title={i18n.t('legal:tos')}
                subheader={i18n.t('agreements:version', { version: legal.tos.version })}
                body={<ReactMarkdown remarkPlugins={[gfm]}>{tosText}</ReactMarkdown>}
                actionLabel={i18n.t('agreements:actions.acceptTos')}
                onAccept={() => {
                  return accept('tos', api.agreements.editTos, legal.tos.version);
                }}
                disabled={pending === 'tos'}
              />
            )
            : <Alert severity="success">{i18n.t('agreements:prompts.tosCurrent')}</Alert>}
        </Grid>

        <Grid item>
          {privacyOutdated
            ? (
              <AgreementCard
                title={i18n.t('legal:privacy')}
                subheader={i18n.t('agreements:version', { version: legal.privacy.version })}
                body={<ReactMarkdown remarkPlugins={[gfm]}>{privacyText}</ReactMarkdown>}
                actionLabel={i18n.t('agreements:actions.acceptPrivacy')}
                onAccept={() => {
                  return accept('privacy', api.agreements.editPrivacy, legal.privacy.version);
                }}
                disabled={pending === 'privacy'}
              />
            )
            : <Alert severity="success">{i18n.t('agreements:prompts.privacyCurrent')}</Alert>}
        </Grid>

        {allCurrent &&
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => { navigate('/', { replace: true }); }}
            >
              {i18n.t('agreements:actions.continue')}
            </Button>
          </Grid>}
      </Grid>
    </Container>
  );
};

Agreements.propTypes = {
  viewer: ViewerType.isRequired,
  refreshSession: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return { viewer: state.session.viewer };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshSession: () => { return dispatch(actions.session.read()); },
    alertError: (message) => { return dispatch(actions.app.alert.error(message)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Agreements);
