const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      minlength: [3, 'Minimum characters must 4'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    countryCode: {
        type: String,
        match: /^\+\d{1,4}$/,
    },
    phoneNumber: {
        type: String,
        unique: true,
        match: /^\d{8,10}$/,
    },
    password: {
        type: String,
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    varified: {
      type: String,
      default: false,
    }
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };
};

const User = mongoose.model('user', userSchema);

module.exports = User;