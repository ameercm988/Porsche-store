const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');

module.exports = {
    doLogin : (adminData) => {
        // console.log(adminData);
        return new Promise(async(resolve,reject) => {
            const adminInfo = {}
          const admin = await db.get().collection(collection.adminCollections).findOne({email : adminData.email})
            if (admin) {
                bcrypt.compare(adminData.password,admin.password).then((data) =>{
                     // console.log(admin);
                if (data) {
                    adminInfo.isAdminValid = true
                    adminInfo.admin = admin
                    resolve(adminInfo)
                    // console.log(adminInfo);
                }else{
                    adminInfo.isAdminValid = false
                    resolve(adminInfo)
                    // console.log(adminInfo);
                }
            })
               
            }else{
                adminInfo.isAdminValid = false
                    resolve(adminInfo)
            }
        })
    }
}

