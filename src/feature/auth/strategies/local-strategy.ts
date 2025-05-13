import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../auth/models/user.model";
import bcrypt from 'bcrypt';
import { AppError, errorKinds } from "../../../utils/error-handling";

export default passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email: string, password: string, done: any) => {
            try {
                const user = await User.findOne({ email });
                if (!user) throw AppError.new(errorKinds.invalidCredential, "User not found.");

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch)
                    throw AppError.new(errorKinds.invalidCredential, "Incorrect password.");
                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
)