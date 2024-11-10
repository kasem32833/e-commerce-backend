const express = require('express');
const { processRegister ,getUsers,  deleteUserById, getUserById, activateUserAccount } = require('../controllers/userController');
const userRouter  =  express.Router();


userRouter.post('/process-register', processRegister)
userRouter.post('/verify', activateUserAccount)
userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.delete('/:id', deleteUserById)

//userRouter.get('/profile', userProfile)


module.exports = userRouter;