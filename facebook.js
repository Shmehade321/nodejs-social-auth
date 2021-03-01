const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./User");

module.exports = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.APP_HOST}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "name", "picture.type(large)"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          facebook_id: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          image: profile.photos[0]?.value,
        };

        try {
          let user = await User.findOne({ facebook_id: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
