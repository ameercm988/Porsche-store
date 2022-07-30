const bcrypt = require('bcrypt')
const db = require('../config/connections')
const collection = require('../config/collections')
const { json } = require('express')
const objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            const userSignInfo = {}
            userData.password = await bcrypt.hash(userData.password, 10);
            db.get().collection(collection.USER_COLLECTIONS).insertOne({
                firstname: userData.firstname,
                lastname: userData.lastname,
                username: userData.username,
                email: userData.email,
                password: userData.password,
                confirmpassword: userData.confirmpassword,
                mobilenumber: userData.mobilenumber,
                block: false
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
        return new Promise((resolve, reject) => {
            const userInfo = {}
            db.get().collection(collection.USER_COLLECTIONS).findOne({ email: userData.email }).then((user) => {
                if (user) {
                    let blockStatus = user.block
                    bcrypt.compare(userData.password, user.password).then((data) => {
                        if (data) {
                            if (blockStatus) {
                                userInfo.blockStatus = true
                                userInfo.isUserValid = false
                                userInfo.err = "You're blocked from this website"
                                resolve(userInfo)
                            } else {
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

    
    addToCart: (proId, userId) => {
        // console.log(userId+"   usrId");
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION).updateOne({user: objectId(userId), 'products.item' : objectId(proId) }, { $inc : { 'products.$.quantity' : 1 } }).then(() => {
                            resolve()
                        })
                } else {
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) }, { $push: { products: proObj } }).then(() => {
                        resolve()
                    })
                }
            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }
                // console.log(user+",,,,,,,,,,,,,,,,,,,,,,,when adding newcart");
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((res) => {
                    resolve(res)

                    // console.log(res + "   res from cart");
                })

            }
        })
    },

    getCartDetails: (userId) => {
        // console.log(userId+'[[[[[[[[[[[[[[[[[[[[[[[[[when getting cart details');
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([

                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity : '$products.quantity'
                    }
                },

                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTIONS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: {$arrayElemAt: ['$product', 0]} 
                    }
                }

            ]).toArray()
            // console.log(cartItems);
            // console.log(cartItems.products);
            resolve(cartItems)
        })
    },
     
    getCartCount : (userId) => {
        // console.log(userId+".......................looking for cartcount");
        return new Promise(async(resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user : objectId(userId)})
            // console.log(cart+'>>>>>>>>>>cart');
            if (cart) {
                count = cart.products.length
                // console.log(count);
            }else{
                count = 0
            }
            resolve(count)
        })
    },

    changeQuantity : (data) => {
        count = parseInt(data.count)

        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({_id : objectId(data.cart), 'products.item' : objectId(data.product) },
            {
                $inc : { 'products.$.quantity' : count }
            })
            .then((response) => {
                // console.log(response);
                resolve(true)
            })
        })
    },

        removeCartItem : (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({_id : objectId(data.cart), 'products.item' : objectId(data.product)},
            {
                $pull : {products : {item : objectId(data.product)}}
            })
            .then((response) => {
                resolve({removeProduct : true})
            })
        })
    }
}