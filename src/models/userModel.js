const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultUserImage } = require('../secret');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is missing"],
        trim: true,
        maxlength: [31, 'Username can not more than 31 character'],
        minlength: [3,  'Username at least 3 character ']
    },
    email: {
        type: String,
        required: [true, "User email is missing"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v)=>{
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            } ,
            message: "Please enter a valid email"
        }
       
       },
    password : {
        type: String,
        required: [true, "User password is require"],
        trim: true,
        minlength: [6,  'Username at least 6 character'],
        set: (v)=> bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image : {
        type: String,
        default: defaultUserImage,
        
    },

    phone : {
        type: String,
        required: [true, "User phone number is require"],
        
    },
    isAdmin : {
        type: Boolean,
        default: false
        
    },
    isBanned : {
        type: Boolean,
        default: false
        
        
    },
    },{timestamps : true})

module.exports = mongoose.model("user", userSchema)