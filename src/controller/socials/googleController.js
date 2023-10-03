require("dotenv").config();
import passport from "passport";
import loginRegisterService from "../../service/loginRegisterService";

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const configLoginWithGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        const type = "GOOGLE";
        let dataRaw = {
          userName: profile.displayName,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : "",
          googleId: profile.id,
        };
        let user = await loginRegisterService.upsertUserSocialMedia(
          type,
          dataRaw
        );
        return done(null, user);
      }
    )
  );
};

export default configLoginWithGoogle;
