import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as authService from '../services/auth.service';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.FRONTEND_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const username = profile.displayName;
        const profilePic = profile.photos?.[0]?.value || ''; // set to empty string if no profile

        if (!email) {
          return done(new Error("No email found from Google provider"), undefined);
        }

        const user = await authService.processGoogleUser(googleId, email, username, profilePic);

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);