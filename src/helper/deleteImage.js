const fs = require('fs').promises;

const deleteImage = async(userImagePath)=>{
    try {
        await fs.access(userImagePath)
        await fs.unlink(userImagePath)
        console.log("User image ware deleted successfully")

    } catch (error) {

        console.error('User profile image doesnot exist')
    }
    
}

module.exports =  {deleteImage};