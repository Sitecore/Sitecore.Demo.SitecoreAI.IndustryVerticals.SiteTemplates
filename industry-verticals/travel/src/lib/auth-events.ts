type AuthEventType =
  | 'login_initiated'
  | 'login_succeeded'
  | 'login_failed'
  | 'logout_initiated'
  | 'session_detected';

interface AuthEventPayload {
  type: AuthEventType;
  userId?: string;
  path?: string;
  error?: string;
}

/**
 * Central stub for auth analytics hooks. Replace console logging with
 * your analytics client/API integration when ready.
 */
export function trackAuthEvent(payload: AuthEventPayload): void {
  console.info('[auth-event]', payload);
}

interface SessionLike {
  user?: {
    sub?: string;
  };
}

export function trackAuthSession(session: SessionLike | null | undefined): void {
  if (!session?.user?.sub) {
    return;
  }

  trackAuthEvent({
    type: 'login_succeeded',
    userId: session.user.sub,
  });
}
