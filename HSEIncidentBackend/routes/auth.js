const express = require('express');
const router  = express.Router();

const crypto   = require('crypto');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const User     = require('../models/User');
const { sendMail } = require('../utils/mailer');

/* -------------------------------------------------------- */
/*  SIGN‑UP                                                */
/* -------------------------------------------------------- */
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await new User({ email, password: hashed }).save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

/* -------------------------------------------------------- */
/*  LOGIN                                                  */
/* -------------------------------------------------------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)   return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      'secret123',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

/* -------------------------------------------------------- */
/*  FORGOT PASSWORD CODE                                     */
/* -------------------------------------------------------- */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = crypto.randomInt(100000, 999999).toString(); // 6‑digit
    user.resetCode        = code;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;      // 10 min
    await user.save();

    await sendMail({
      to: email,
      subject: 'Your Password Reset Code',
      html: `<p>Your reset code is <b>${code}</b> (valid 10 minutes).</p>`,
    });

    res.json({ message: 'Reset code sent to email' });
  } catch (err) {
    console.error('Forgot‑password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------------------------------------------- */
/*  RESET PASSWORD                                         */
/* -------------------------------------------------------- */
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid =
      user.resetCode === code && Date.now() < user.resetCodeExpires;

    if (!valid) return res.status(400).json({ message: 'Invalid / expired code' });

    user.password        = await bcrypt.hash(newPassword, 10);
    user.resetCode       = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset‑password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
