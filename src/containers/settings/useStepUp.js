import { useState } from 'react';

// Is this refusal "prove who you are", or a real one?
//
// The password, email and username flows treat any 403 as a step-up
// prompt, and can: no live proof is the only reason those endpoints
// ever answer 403. The OAuth endpoints have others — not a super
// admin, or a token without oauth:write — and answering those with a
// passkey prompt would ask somebody for something that cannot help
// them, then loop when it succeeded and the write failed again.
//
// So the server bodies this one, and this reads the body. A bare 403
// is deliberately NOT treated as step-up here.
const isStepUpRequired = (err) => {
  const response = err && err.response;

  return Boolean(
    response &&
    response.status === 403 &&
    response.data &&
    response.data.error === 'step_up_required',
  );
};

// Runs writes that may need a step-up first.
//
// The server does not ask in advance. A write is attempted, and a 403
// carrying step_up_required is the instruction to prove presence and
// try again — which is why nothing here inspects enrolment beforehand.
// An earlier version of this screen did: it read GET /totp on mount
// and disabled every control for anybody without TOTP. That was a
// guess at the server's answer, and it was the wrong guess in both
// directions — it locked out people holding a passkey, and it would
// have gone on locking out everybody even after enrolment, because the
// gate it was predicting denied all comers.
//
// The proof itself is whatever the person has: a passkey, a passcode,
// or a password. containers/auth/StepUp offers what the server says
// they hold, and /reauth writes a marker good for five minutes.
const useStepUp = () => {
  const [pending, setPending] = useState(null);

  // action does the whole operation including its own success
  // handling; onError reports anything that is not a step-up.
  //
  // attempt stashes ITSELF rather than action, so a retry that is
  // refused again re-opens the dialog instead of falling through
  // unhandled — a marker can expire between the proof and the write,
  // and two people can spend the same one.
  const runGuarded = (action, onError) => {
    const attempt = () => {
      return Promise.resolve()
        .then(action)
        .catch((err) => {
          if (isStepUpRequired(err)) {
            // Wrapped in an updater, or React would call it.
            setPending(() => {
              return attempt;
            });
            return undefined;
          }

          onError(err);
          return undefined;
        });
    };

    return attempt();
  };

  const onVerified = () => {
    const retry = pending;
    setPending(null);

    if (retry) {
      retry();
    }
  };

  // Abandoning the proof abandons the write. Nothing was sent, so
  // there is nothing to undo and nothing to report.
  const onCancel = () => {
    setPending(null);
  };

  return {
    stepUpOpen: Boolean(pending),
    runGuarded,
    onVerified,
    onCancel,
  };
};

export default useStepUp;
