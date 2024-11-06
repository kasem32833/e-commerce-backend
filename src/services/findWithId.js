const  mongoose  = require("mongoose");
const createError = require("http-errors");
const User = require("../models/userModel");


const findWithId = async (Model, id, options = {}) => {
  try {
  
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, "Item does not exist with this id");
    }
    return item;
  } catch (error) {
    if(error instanceof mongoose.Error){
       throw createError(400, `No ${Model.modelName} found with this ID`)
    }
    throw error;
  }
};


module.exports = {findWithId};