import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;

// ── Google OAuth helper ───────────────────────────────────────────────────────
// Triggers the Google OAuth flow via Better Auth's oAuthProxy plugin.
// callbackURL is where the user lands after Google redirects back.
export const signInWithGoogle = (callbackURL = '/seeker/dashboard') => {
  // Use absolute URL to ensure we redirect back to the frontend (port 3000)
  // instead of landing on the backend (port 5000)
  const fullURL = typeof window !== 'undefined' 
    ? `${window.location.origin}${callbackURL}` 
    : callbackURL;

  return authClient.signIn.social({
    provider: 'google',
    callbackURL: fullURL,
  });
};