import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import LockIcon from '@material-ui/icons/LockOutlined';

import api from '../../api';
import i18n from '../../languages';

// Where somebody lands when they are not signed in.
//
// THIS APP NO LONGER SIGNS ANYBODY UP. Signing in and creating an account both
// happen on auth-service, on server-rendered pages, and this page is two
// buttons that navigate there.
//
// The form used to be here, posting to a JSON endpoint. That was wrong in
// three ways at once: a password travelled through a bundle with hundreds of
// packages behind it, "registration is closed" was a build-time flag the
// browser held while the endpoint stayed open, and the anti-bot measures worth
// having — a honeypot, submission timing, a CSRF-bound form — cannot be done
// in code an attacker reads.
//
// What is left here is the one question this app still has to answer: whether
// to offer the create-account button at all. That comes from NodeInfo, which
// is the server's own answer and the one the signup page itself enforces.
const Auth = () => {
  // null is a third state — not yet known — and it is why neither button is
  // drawn until the answer arrives. Offering an account that is about to be
  // refused, or withholding one on a site that is open, are both worse than a
  // moment of nothing.
  const [signupOpen, setSignupOpen] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.nodeInfo.read()
      .then(({ data }) => {
        if (!cancelled) {
          setSignupOpen(Boolean(data.openRegistrations));
        }
      })
      .catch(() => {
        // Unknown is treated as closed. Somebody who was invited still has
        // their link, and it does not come through this page.
        if (!cancelled) {
          setSignupOpen(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (signupOpen === null) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              <LockIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {i18n.t('auth:cTitle')}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {signupOpen
              ? i18n.t('auth:signup.invitation')
              : i18n.t('auth:signup.closed')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => { return api.session.login(); }}
          >
            {i18n.t('actions:login')}
          </Button>
        </CardActions>
        {signupOpen &&
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => { return api.session.signup(); }}
            >
              {i18n.t('auth:signup.mTitle')}
            </Button>
          </CardActions>}
      </Card>
    </Container>
  );
};

export default Auth;
