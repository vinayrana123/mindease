const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  age: user.age,
  gender: user.gender,
  profilePhoto: user.profilePhoto,
  notificationPreferences: user.notificationPreferences,
  createdAt: user.createdAt
});

const register = async (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'Account already exists for this email' });
  }

  const user = await User.create({ name, email, password, age, gender });
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: sanitizeUser(user)
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: sanitizeUser(user)
  });
};

const logout = async (req, res) => {
  res.json({ message: 'Logout successful on client side; discard stored token.' });
};

const getProfile = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

const updateProfile = async (req, res) => {
  const updates = ['name', 'age', 'gender', 'profilePhoto', 'notificationPreferences'];

  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  res.json({ message: 'Profile updated', user: sanitizeUser(req.user) });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
};
