import passport from "passport";
import "../feature/auth/strategies/local-strategy";

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('deserializeUser', user);
  done(null, "ddd");
});

// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: ENV.ACCESS_TOKEN_PRIVATE_KEY as string,
//       algorithms: ["RS256"],
//     },
//     async (jwt_payload, done) => {
//       try {
//         const user = await User.findById(jwt_payload.id);
//         if (user) return done(null, user);
//         else return done(null, false);
//       } catch (err) {
//         return done(err, false);
//       }
//     }
//   )
// );
