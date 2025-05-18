import passport from "passport";
import "../feature/auth/strategies/local-strategy";
import "../feature/auth/strategies/jwt-strategy";
import "../feature/auth/strategies/google-strategy";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, "ddd");
});
