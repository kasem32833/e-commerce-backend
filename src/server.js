
const port = 3000
const app = require('./app');
const connectDB = require('./config/db');
//  const { serverPort } = require('./secret');



app.listen(port, async()=>{
    console.log('server is running at http://localhost:3000');
    await connectDB();
})



