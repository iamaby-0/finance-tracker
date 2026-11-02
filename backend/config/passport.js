const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://finance-tracker-m46z.onrender.com/aft/api/v1/auth/google/callback",
        proxy: true
    },

    async (accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value;
            const rawName = (profile.displayName || profile.name?.givenName || (email ? email.split('@')[0] : "Google User")).trim();
            const name = (rawName.length >= 2 ? rawName : `${rawName || "User"} User`).slice(0, 50);
            const profilePicture = profile.photos?.[0]?.value;

            if (!email) {
                return done(
                    new Error("Email not found in Google profile"),
                    null
                );
            }

            const normalizedEmail = email.toLowerCase().trim();

            let user = await User.findOne({ googleId });

            if (user) {
                if (!user.profilePicture && profilePicture) {
                    user.profilePicture = profilePicture;
                    await user.save();
                }
                return done(null, user);
            }

            user = await User.findOne({ email: normalizedEmail });

            if (user) {
                user.googleId = googleId;
                user.authProvider = "google";
                if (!user.profilePicture && profilePicture) {
                    user.profilePicture = profilePicture;
                }

                await user.save();

                return done(null, user);
            }

            // Create a new user if not found
            user = await User.create({
                name,
                email: normalizedEmail,
                googleId,
                authProvider: "google",
                profilePicture,
                occupation: "student",
            });

            return done(null, user);
        }
        catch (err) {
            console.error("Passport Google Strategy error:", err);
            return done(err, null);
        }
    }
));

module.exports = passport;
