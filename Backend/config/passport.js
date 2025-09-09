// /config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('../db'); // adjust path if needed

// Configure the local strategy for passport (login by email)
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    // Fetch user by email
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    // Compare password using bcrypt
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    // Authentication successful
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user (save user id in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user (fetch user by id from DB on future requests)
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});
