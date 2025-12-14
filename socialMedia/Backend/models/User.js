import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    profile_pic: {
    type: String,
    default: ''
    },

    location: {
    type: String,
    default: ''
    },

    followers: {
    type: String,
    ref: 'User'
    },

    following: {
    type: String,
    ref: 'User'
    },
    password: { 
      type: String,
      required: true,
    },
    connections: {
    type: String,
    ref: 'User'
    },
  },{timestamps: true, minimize: false}

);

const User = mongoose.model('User', userSchema)

export default User
