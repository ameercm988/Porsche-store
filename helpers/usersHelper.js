const bcrypt = require('bcrypt')
const db = require('../config/connections')
const collection = require('../config/collections')
const objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            const userSignInfo = {}
            userData.password = await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.USER_COLLECTIONS).insertOne({
                firstname : userData.firstname,
                lastname : userData.lastname,
                username : userData.username,
                email : userData.email,
                password : userData.password,
                confirmpassword : userData.confirmpassword,
                mobilenumber : userData.mobilenumber,
                block : false
            }).then((data) => {
            // db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data) => {
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
        return new Promise( (resolve, reject) => { 
            const userInfo = {}
            db.get().collection(collection.USER_COLLECTIONS).findOne({ email: userData.email }).then((user) => {
                if (user) {
                    let blockStatus = user.block
                    bcrypt.compare(userData.password, user.password).then((data) => {
                        if (data) {
                            if(blockStatus){
                                userInfo.blockStatus = true
                                userInfo.isUserValid = false
                                userInfo.err = "You're blocked from this website"
                                resolve(userInfo)
                            }else{
                            userInfo.isUserValid = true;
                            userInfo.user = user;
                            resolve(userInfo)
                            }
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
    },  

    addToCart : (proId, userId) => {
        return new Promise(async(resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user : objectId(userId)})
            if (userCart) {
                
            } else {
                let cartObj = {
                    user : objectId(user),
                    products : [objectId(proId)]
                    //<<<<<<<<<<>>>>>>>>>>>
                }
                db.get().collection(collection.CART_COLLECTION).insertOne()
            }
        })
    }
}