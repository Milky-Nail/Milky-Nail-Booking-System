import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as authService from "../services/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0].value;
        const avatar = profile.photos?.[0].value;

        const user = await authService.upsertGoogleUser({
          googleId,
          name,
          email,
          avatar,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;
