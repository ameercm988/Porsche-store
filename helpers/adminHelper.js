const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
// const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');
// const { ObjectID } = require('bson');
const objectId = require('mongodb').ObjectId

module.exports = {
    doLogin : (adminData) => {
        // console.log(adminData);
        return new Promise(async(resolve,reject) => {
            const adminInfo = {}
          const admin = await db.get().collection(collection.ADMIN_COLLECTIONS).findOne({email : adminData.email})
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
                    adminInfo.err = "Email & password doesn't match"
                    resolve(adminInfo)
                    // console.log(adminInfo);
                }
            })
               
            }else{
                adminInfo.isAdminValid = false
                    resolve(adminInfo)
            }
        })
    },

    viewUsers : () => {
        return new Promise(async(resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTIONS).find().toArray()
            resolve(users)
        })
    },

    blockUser : (userId) => {
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTIONS).updateOne({_id : objectId(userId)}, {$set : {block : true}}).then((res) => {
                resolve(res)
            })
        })
    },

    unBlockUser : (userId) => {
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTIONS).updateOne({_id : objectId(userId)}, {$set : {block : false}}).then((res) => {
                resolve(res)
            })
        })
    }

}

