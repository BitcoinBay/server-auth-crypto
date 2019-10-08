require('dotenv').config();
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

//simple schema
const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  signature: {
    type: String,
    required: true
  }
/*
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }
*/
});

//custom method to generate authToken
AddressSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ address: this.address }, this.signature, { noTimestamp: true }); //get the private key from the config file -> environment variable
  return token;
}

const Address = mongoose.model('Address', AddressSchema);

//function to validate Address
function validateAddress(address) {
  const schema = Joi.object({
    address: Joi.string().required(),
    signature: Joi.string().required()
//    name: Joi.string().min(3).max(50).required(),
//    email: Joi.string().min(5).max(255).required().email(),
//    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(address);
}

exports.Address = Address;
exports.validate = validateAddress;
