const User = require('../models/User');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const parser = require('body-parser');
const jsonParser = parser.json();

exports.authUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log('AuthUser--->', user);
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.loginUser = async (req, res, next) => {
  console.log('1');
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('2');
    return res.status(400).json({ errors: errors.array() });
  }
  console.log('3');

  const { email, password } = req.body;
  console.log('LoginUser---->', req.body);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
