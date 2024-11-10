const nodemailer = require("nodemailer");
const { smtpUser, smtpPassword } = require("../secret");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword
    },
  });


const varificationEmail = async(emailData) =>{
    try {
        const mailOption = {
            from: smtpUser, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        }
   const info =  await transporter.sendMail(mailOption);

   console.log("Message Sent: $%" , info.response);
        
    } catch (error) {
        console.error('Error while sending email')
        throw error;
    }
    
}


module.exports = varificationEmail;