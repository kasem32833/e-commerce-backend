require('dotenv').config();
const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017";
const defaultUserImage = process.env.DEFAULT_IMAGE_PATH || "../public/images/users/defaultUser.";
const serverPort = process.env.SERVER_PORT || 3002;



module.exports = {serverPort, mongodbURL, defaultUserImage}
