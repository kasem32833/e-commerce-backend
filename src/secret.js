require('dotenv').config();
const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017";
const defaultUserImage = process.env.DEFAULT_IMAGE_PATH || "../public/images/users/defaultUser.";
const serverPort = process.env.SERVER_PORT || 3002;
const jwtSecret =  process.env.JWT_SECRET || '' ;
const smtpUser = process.env.SMTP_USER_NAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''
const clientUrl = process.env.CLIENT_URL 




module.exports = {
    serverPort, 
    mongodbURL, 
    defaultUserImage, 
    jwtSecret, 
    smtpPassword, 
    smtpUser, 
    clientUrl
}
