const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean');
const createError = require('http-errors')
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, //1 minute,
    max: 50,
    message: "Toomany request form this IP, please try again later"
})

// middleware
app.use(rateLimiter)
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(xssClean());
app.use('/api/users',userRouter);
app.use('/api/seed', seedRouter);





app.get('/test', (req, res)=>{
    res.send('Welcome from node server is ');
})

// client handling middleware (if someone send wrong route)
app.use((req,res, next)=>{
    next(createError(404, "Route not found"))
})

// server error handling middleware (if someone send wrong route)->all the errors
app.use((err, req, res, next)=>{
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    })
})



module.exports = app;







