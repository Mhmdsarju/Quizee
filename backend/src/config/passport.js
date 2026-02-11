import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config()


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLEID,
      clientSecret: process.env.GOOGLESECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            isVerified: true,
            role: "user",
            password: "GOOGLE_AUTH", 
          });
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
