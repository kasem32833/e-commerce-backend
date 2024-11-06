const createError = require("http-errors");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const { findWithId } = require("../services/findWithId");
const { successResponse, errorResponse } = require("./responseController");
const { deleteImage } = require("../helper/deleteImage");

const processRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, address } = req.body;
    
    // check user is exist
    const existsUser = await User.exists({email: email});
    if(existsUser){
      throw createError(409, "User already exists please sign in");
    }
    
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    console.log(newUser);
    return successResponse(res, {
      statusCode: 200,
      message: "User Was Created Successfully",
      payload: {
        newUser
      }
    })
  } catch (error) {
    next(error);
  }
};

//@desc: get all users without admin
//route : api/users
//privecy : public

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

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
    const user = await findWithId(id, options);
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

module.exports = { processRegister, getUsers, getUserById, deleteUserById };
