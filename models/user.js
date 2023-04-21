import { Schema, model } from 'mongoose';

const userSchema = new Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  avatar: {
    type: String,
    required: true,
  },
});

export default model('user', userSchema);
