const bcrypt = require('bcrypt')
const db = require('../config/connections')
const collection = require('../config/collections')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            const userSignInfo = {}
            userData.password = await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.usersCollections).insertOne(userData).then((data) => {
                // console.log(data);
                if (data) {
                    userSignInfo.isUserValid = true;
                    userSignInfo.user = userData;
                    resolve(userSignInfo)
                } else {
                    userSignInfo.isUserValid = false;
                    resolve(userSignInfo)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },

        doLogin: (userData) => {
        // console.log(userData);
        return new Promise( (resolve, reject) => {
           
            const userInfo = {}
            db.get().collection(collection.usersCollections).findOne({ email: userData.email }).then((user) => {
                // console.log(user);
                if (user) {
                    console.log(user);
                    bcrypt.compare(userData.password, user.password).then((data) => {
                        // console.log("hiii",data);
                        if (data) {
                            // userInfo.user = true
                            userInfo.isUserValid = true;
                            userInfo.user = user;
                            resolve(userInfo)
                        } else {
                            
                            userInfo.isUserValid = false;
                            userInfo.err = "Email & password doesn't match"
                            console.log('user w/o password');
                            resolve(userInfo)
                        }
                    })
                } else {
                    userInfo.isUserValid = false;
                    userInfo.err = "NO USER EXISTS"
                    reject(userInfo)
                }
            }).catch((dataBaseError) => {
                reject(dataBaseError)
            })
        })
    }
}