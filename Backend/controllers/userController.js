const { updatePassword, getUserById, listUsers, updateUser, deleteUser, createUser } = require('../models/userModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');




const userSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string().min(8).max(16)
    .pattern(/[A-Z]/)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .required(),
  role: Joi.string().valid('normal', 'admin', 'store_owner').required() //// Now it can be anything because admin is creating it.
});



// List/filter users
exports.adminListUsers = async (req, res) => {
  const { q, role, sortBy, order } = req.query;
  try {
    const users = await listUsers({ search: q || '', role: role || '', sortBy, order });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






exports.adminCreateUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0] });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user in DB
    const newUser = await createUser({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      role: req.body.role
    });

    res.status(201).json({ message: 'User created.', user: newUser });
  } catch (err) {
    // handle duplicate email, db errors, etc.
    if (err.code === '23505') { // Postgres duplicate key
      return res.status(400).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};





exports.adminUpdateUser = async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User updated.', user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: delete any user
exports.adminDeleteUser = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (!result) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted.', id: result.id });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};










const passwordSchema = Joi.object({
  oldPassword: Joi.string().required(), // required if you want extra security!
  newPassword: Joi.string().min(8).max(16)
    .pattern(/[A-Z]/)
    .pattern(/[!@#$%^&*(),.?":{}|<>]/)
    .required()
});

exports.changePassword = async (req, res) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const user = await getUserById(req.user.id);
    // Verify old password matches
    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match) return res.status(401).json({ error: "Old password is incorrect." });

    // Hash new password
    const newHashed = await bcrypt.hash(req.body.newPassword, 10);

    // Update in DB
    await updatePassword(req.user.id, newHashed);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.log("Here we catch")
    res.status(500).json({ error: err.message });
  }
};

