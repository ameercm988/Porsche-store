const bcrypt = require('bcrypt')
const db = require('../config/connections')
const collection = require('../config/collections')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async(resolve,reject) => {
            userData.password = await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.usersCollections).insertOne(userData).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })

        })
    },
    doLogin : (userData) => {
        console.log(userData);
        return new Promise(async(resolve,reject) => {
            const userInfo = {}
            const user = await db.get().collection(collection.usersCollections).findOne({email: userData.email})
            console.log(user);
            if (user) {
                bcrypt.compare(userData.password, user.password).then((data) => {
                    console.log(data);
                    if(data){
                        userInfo.isUserValid = true;
                        userInfo.user = user;
                        resolve(userInfo)
                    }else{
                        userInfo.isUserValid = false;
                        resolve(userInfo)
                    }   
                })
            }else{
                userInfo.isUserValid = false;
                resolve(userInfo)
            }
        })
    }
}