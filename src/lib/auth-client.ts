import { createAuthClient } from 'better-auth/react';

const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_FRONTEND_URL;
  if (url && url.startsWith('http')) return url;

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3000'; // Fallback for local dev
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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
  // Use absolute URL to ensure we redirect back to the frontend
  const fullURL = typeof window !== 'undefined' 
    ? `${window.location.origin}${callbackURL}` 
    : callbackURL;

  return authClient.signIn.social({
    provider: 'google',
    callbackURL: fullURL,
  });
};