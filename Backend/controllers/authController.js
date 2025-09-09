const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../models/userModel');

const registerSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16).pattern(/[A-Z]/).pattern(/[!@#$%^&*(),.?":{}|<>]/).required(),
  address: Joi.string().max(400).required(),
  role: Joi.string().valid('admin', 'normal', 'store_owner').required() ////************************** Fix this, It cannot be admin */
});

exports.register = async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check if email already exists
    // const existing = await getUserByEmail(req.body.email);
    // if (existing) return res.status(400).json({ error: "Email is already registered." });

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user
    const user = await createUser({
      ...req.body,
      password: hashedPassword
    });
    // Don’t return the password!
    delete user.password;
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.login = (req, res) => {
  // req.user is populated by Passport after successful login
  if (!req.user) {
    // Shouldn't happen if Passport is used correctly
    return res.status(400).json({ error: "Invalid credentials." });
  }
  // Don't send the password hash!
  const user = { ...req.user };
  delete user.password;
  res.json({ message: "Login successful!", user });
};



exports.whoami = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const user = { ...req.user };
  delete user.password;
  res.json({ user });
};



exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return res.status(500).json({ error: err.message }); }
    res.json({ message: 'Logged out successfully!' });
  });
};






const adminCreateSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16)
      .pattern(/[A-Z]/)
      .pattern(/[!@#$%^&*(),.?":{}|<>]/)
      .required(),
  address: Joi.string().max(400).required(),
  role: Joi.string().valid('admin', 'normal', 'store_owner').required()
});

exports.adminCreateUser = async (req, res) => {
  try {
    const { error } = adminCreateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existing = await getUserByEmail(req.body.email);
    if (existing) return res.status(400).json({ error: "Email is already registered." });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await createUser({
      ...req.body,
      password: hashedPassword
    });
    delete user.password;
    res.status(201).json({ message: "User created.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};