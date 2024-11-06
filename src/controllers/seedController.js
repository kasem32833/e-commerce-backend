const data = require("../data")
const userModel = require("../models/userModel")





const seedUser = async(req,res, next)=>{
try {
    // deleting all existing user
    await userModel.deleteMany({})

    // insert new user
    const users = await userModel.insertMany(data.users)
    return res.status(201).json({message: "User Created successfully", users})
} catch (error) {
    next(error)
}
}

module.exports = {seedUser};