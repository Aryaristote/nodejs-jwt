const mongoose = require('mongoose');
const { isEMail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an Email'],
        unique: true,
        lowercase: true,
        validation: [isEMail, 'Please enter a valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a Password'],
        minlength: [6, 'Minimum Password length is 6 characters'],
    }
})

// Fire a function before Document saved into the DB
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password){
    const user = await this.findOne({ email: email });
    if(user){
        //Compare input password & hashed password from DB
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email")
}

//Fire a function after Document saved into the DB (Can't access Doc)
// userSchema.post('save', function (doc, next) {})

//Saving data in DB
const User = mongoose.model('user', userSchema);

module.exports = User;