const createError = require('http-errors');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const { findWithId } = require("../services/findWithId");
const { successResponse, errorResponse } = require("./responseController");
const { deleteImage } = require("../helper/deleteImage");
const { jwtTokenGenerator } = require("../helper/jwtTokenGenerator");
const { jwtSecret, clientUrl } = require("../secret");
const varificationEmail = require("../helper/mail");
const e = require("express");

// start register an user 
const processRegister = async (req, res, next) => {
  try {
    // get all data from req body
    const { name, email, phone, password, address } = req.body;
    // check all required field 
    
    // check user is exist
    const existsUser = await User.exists({email: email});
    if(existsUser){
      throw createError(409, "User already exists please sign in");
    }
    
    const jwtToken = jwtTokenGenerator({
      name,
      email,
      password,
      phone,
      address
    }, jwtSecret, {expiresIn: "10m"});

    
    // prepare email

    const emailData = {
      email,
      subject: "account activation mail",
      html: `
      <h1>Hello ${name} !</h1>
      <p>Please click here to <a href="${clientUrl}/api/users/verify/${jwtToken}">activate your account</a></p>
      `
    }

    // send email
    try {
      await varificationEmail(emailData);
    } catch (emailGenError) {
      next(createError(500, 'Failed to send varification email'))
      return;
    }


    return successResponse(res, {
      statusCode: 200,
      message: `please check your email ${email} for completing registration`,
      payload: {
        jwtToken
      }
    })
  } catch (error) {
    next(error);
  }
};

// activate an User
const activateUserAccount = async (req, res, next) => { 
 try {
  const token = req.body.token;
  if(!token || '') {
    next(createError(404, "Token not found")) 
  }
  // verify token and get data form token
  const decoded = jwt.verify(token, jwtSecret )
  // check aganin is exists user or not because user can click two times from the mail link wtihin token expiry time
  const existsUser = await User.exists({email: decoded.email});
    if(existsUser){
      next(createError(409, "User already exists please sign in"));
    }
  // create User
  const newUser = await User.create(decoded);
  return successResponse(res, {
    statusCode: 201,
    message: `User Was Register Successfully`,
    payload: newUser
  })
  
 } catch (error) {
    console.error(error.message);
}

};

// get all users
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchRegExp = new RegExp(".*" + search + ".*");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    // don't show password
    const options = { password: 0 };

    // get user based on filter and skip user based on limit per page
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    // totola user count based on filter
    const count = await User.find().countDocuments();

    console.log(count);

    if (!users) throw createError(404, "No User found");
    return successResponse(res, {
      statusCode: 200,
      message: "Uasers were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// get single user based on id
const getUserById = async (req, res, next) => {
  try {
    // get id form  req params
    const id = req.params.id;
    // don't show password
    const options = { password: 0 };
    // find user using findWithId service function
    const user = await findWithId( User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User Were Returned Success fully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// delete single user based on id
const deleteUserById = async (req, res, next) => {
  try {
    // get id form  req params
    const id = req.params.id;
    // don't show password
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    const userImagePath = user.image;
    // image delete helper function
    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id, 
      isAdmin: false
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User Were Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  processRegister, 
  getUsers, 
  getUserById, 
  deleteUserById,
  activateUserAccount
 };
