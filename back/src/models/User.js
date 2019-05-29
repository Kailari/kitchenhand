const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 64
  },
  loginname: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 64
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 128
  }
})

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', schema)
