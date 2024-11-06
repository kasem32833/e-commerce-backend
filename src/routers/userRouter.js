const express = require('express');
const { processRegister ,getUsers,  deleteUserById      , getUserById } = require('../controllers/userController');
const userRouter  =  express.Router();


userRouter.post('/process-register', processRegister)
userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.delete('/:id', deleteUserById)

//userRouter.get('/profile', userProfile)


module.exports = userRouter;