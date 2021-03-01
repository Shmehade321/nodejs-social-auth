const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("./User");

module.exports = (passport) => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_ID,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.APP_HOST}/api/auth/twitter/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          twitter_id: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          image: profile.photos?.values,
        };

        try {
          let user = await User.findOne({ twitter_id: profile.id });

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
