const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model')

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async(accessToken, refreshToken, profile, done) => {
        try{
            const googleId = profile.id;
            const email = profile.emails[0]?.value;
            const name = (profile.displayName || profile.name?.givenName || "Google User").slice(0, 50);
            const profilePicture = profile.photos?.[0]?.value;

            if(!email){
                return done(
                    new Error("Email not found in Google profile"),
                    null
                )
            }

            let user = await User.findOne({ googleId });

            if(user){
                return done(null, user);
            }

            user = await User.findOne({email : email.toLowerCase()});

            if(user){
                user.googleId = googleId;

                user.authProvider = "google";
                user.profilePicture = profilePicture;

                await user.save();

                return done(null, user);
            }


            // Create a new user if not found'
            user = await User.create({
                name,
                email : email.toLowerCase(),
                googleId,
                authProvider : "google",
                profilePicture,
                occupation : "student",
            });

            return done(null, user);
        }
        catch(err){
            return done(err, null);
        }
    }
))

module.exports = passport;