// const google = require("googleapis");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const { googleInfo } = require("../config/config");
const { users } = require("../models");

passport.use(
  new googleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: googleInfo.client_id,
      clientSecret: googleInfo.client_secret,
    },
    (accessToken, refreshToken, profile, done) => {
      users
        .findOrCreate({
          where: { email: profile._json.email },
          defaults: {
            username: profile.displayName,
            password: profile.id,
            phone: "123-1233-1233",
            address: "서울시 OO구 OO로 OOO, 상세주소",
            user_type: 1,
          },
        })
        .then(([user, created]) => {
          done(null, user);
        });
    }
  )
);
