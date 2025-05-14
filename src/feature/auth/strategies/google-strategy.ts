import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";
import { AppError, errorKinds } from "../../../utils/error-handling";
import ENV from "../../../config/custom-env";

export default passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID!,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
      callbackURL: ENV.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          throw AppError.new(errorKinds.invalidCredential, "No email found");
        }

        // Check for existing user by email or googleId
        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (user) {
          throw AppError.new(
            errorKinds.oauthAccountAlreadyExist,
            "Oauth account already exist"
          );
        }

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            email,
            name: profile.displayName,
            provider: "google",
            googleId: profile.id,
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
