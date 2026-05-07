import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { oAuthProxy } from 'better-auth/plugins';

export const auth = betterAuth({
  plugins: [nextCookies(), oAuthProxy()],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});