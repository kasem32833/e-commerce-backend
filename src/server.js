
const port = 5000
const app = require('./app');
const connectDB = require('./config/db');



app.listen(port, async()=>{
    console.log('server is running at http://localhost:5000');
    await connectDB();
})



