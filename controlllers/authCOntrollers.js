require('dotenv').config();
const User = require("../models/User");
const nodemailer = require('nodemailer');
const fAuth = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', email: '', phoneNumber: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  
  if(err.message === 'incorrect email'){
    errors.email = 'That email is not registered'
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email or phoneNumber error
  if (err.code === 11000) {
    errors.email = 'Email & phoneNumber must be unique';
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
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // This is the default port used by MailDev
  ignoreTLS: true,
});
const generateToken = () => crypto.randomBytes(20).toString('hex');

module.exports.signup_post = async (req, res) => {
  const { name, email, countryCode, phoneNumber, password } = req.body;

  try {
    const verificationToken = generateToken();

    //Store in Database
    const user = await User.create({ name, email, countryCode, phoneNumber, password });

    // Send the verification email
    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    const mailOptions = {
      from: 'aryaristote@gmail.com',
      to: email,
      subject: 'Account Verification',
      text: `Click the link below to verify your account:\n${verificationLink}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'User created successfully' });
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