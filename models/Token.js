const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const tokenSchema = new Schema ({
    userId: {
        type: String,
        ref: "user",
        require: true,
    },
    token: {
        type: String,
        required: true,
    }
})

const Token = mongoose.model("token", tokenSchema);
module.exports = Token;