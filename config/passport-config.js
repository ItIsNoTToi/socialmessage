// config/passport-config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user/users');
const bcrypt = require('bcrypt');

passport.use(
  new GoogleStrategy(
    {
      clientID: '342508766919-667rru6vbv12n9dg2u30r2dovknuhpnc.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Tìm người dùng qua email
        let user = await User.findOne({ email });

        if (!user) {
          // Nếu người dùng chưa tồn tại, tạo tài khoản mới
          let phone = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate random phone number
          const hashedPassword = await bcrypt.hash('default_password', 10); // Mật khẩu mặc định cho tài khoản Google
          user = new User({
            username: name,
            email,
            password: hashedPassword,
            phone: phone // Mật khẩu mặc định
          });
          await user.save();
        }

        done(null, user); // Truyền người dùng qua `done`
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
