const { LogContext } = require('twilio/lib/rest/serverless/v1/service/environment/log');
const collection = require('../../config/collections')
const db = require('../../config/connections')

module.exports = {
    verifySignup : (userData) => {
        // console.log('verifysignup');
        return new Promise((resolve, reject) => {
            let err = 'Email or mobile already exists'
            db.get().collection(collection.USER_COLLECTIONS).find({$or : [{email : userData.email}, {mobilenumber : userData.mobilenumber}]}).toArray().then((user)=>{
                console.log(user);
                if (user.length) {
                    console.log(err);
                    resolve(err)
                }else{
                    resolve()
                    // console.log('no err');
                }
            })
            
        })
    },
    // verifyLogin : (userData) => {
    //     return new Promise((resolve, reject) => {
    //         let err = "Email & password doesn't match"
    //         db.get
    //     })
    // }
}