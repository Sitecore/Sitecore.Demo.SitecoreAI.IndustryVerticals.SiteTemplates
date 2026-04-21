import { NextResponse } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { trackAuthEvent, trackAuthSession } from './auth-events';

export const AUTH0_REQUIRED_ENV_KEYS = [
  'APP_BASE_URL',
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_SECRET',
] as const;

export function getMissingAuth0EnvKeys(): string[] {
  return AUTH0_REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
}

const appBaseUrl = process.env.APP_BASE_URL;
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
const auth0Secret = process.env.AUTH0_SECRET;

const hasRequiredAuth0Config = getMissingAuth0EnvKeys().length === 0;

export const auth0 = hasRequiredAuth0Config
  ? new Auth0Client({
      domain: auth0Domain!,
      clientId: auth0ClientId!,
      clientSecret: auth0ClientSecret!,
      secret: auth0Secret!,
      appBaseUrl: appBaseUrl!,
      async onCallback(error, context, session) {
        if (error) {
          trackAuthEvent({
            type: 'login_failed',
            error: error.message,
          });
          return NextResponse.redirect(new URL('/', appBaseUrl!));
        }

        trackAuthSession(session);

        return NextResponse.redirect(new URL(context.returnTo || '/', appBaseUrl!));
      },
    })
  : null;
