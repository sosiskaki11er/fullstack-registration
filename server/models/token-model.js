const {Schema, model} = require('mongoose');
const userModel = require('./user-model');

const TokenSchema = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken:{type: String, required:true}
}) 

module.exports = model('Token',TokenSchema)