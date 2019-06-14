const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
    maxlength: 32
  },
  password: {
    type: String,
    required: true,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  ]
})
schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', schema)
