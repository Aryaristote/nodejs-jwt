const User = require("../models/User");
const Token = require("../models/Token");
const fAuth = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const createToken = (id) => {
  return fAuth.sign({ id }, 'Bolingo@defaultpass', {
    expiresIn: 31536000000
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { name, email, countryCode, phoneNumber, password } = req.body;

  try {
    const user = await User.create({ name, email, countryCode, phoneNumber, password });
    const NewToken = createToken(user._id);
    const token = await Token.create({ userId: user._id, token: NewToken });
    res.cookie('fAuth', token, { httpOnly: true, maxAge: 31536000000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Check if the user exists based on email or phone number
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      console.log('User not found');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log('Invalid credentials');
    }

    // Successful login
    const token = createToken(user._id);
    res.cookie('fAuth', token, { httpOnly: true, maxAge: 31536000000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}