import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import User from "../../auth/models/user.model";
import { accessTokenPublicKey } from "../../../utils/jwt";

export default passport.use(
    'access-jwt',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: accessTokenPublicKey,
            algorithms: ['RS256'],
        },
        async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.id);
                if (user) return done(null, user);
                else return done(null, false);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);