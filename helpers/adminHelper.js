const db = require('../config/connections')
const collection = require('../config/collections')

module.exports = {
    doLogin : (adminData) => {

        return new Promise(async(resolve,reject) => {
            const adminInfo = {}
          const admin = await db.get().collection(collection.adminCollections).findOne({email : adminData.email})
            if (admin) {
                if (admin.password === adminData.password) {
                    adminInfo.isAdminValid = true
                    adminInfo.admin = admin
                    resolve(adminInfo)
                }else{
                    adminInfo.isAdminValid = false
                    resolve(adminInfo)
                }
            }else{
                adminInfo.isAdminValid = false
                    resolve(adminInfo)
            }
        })
    }
}

