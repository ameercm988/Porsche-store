const bcrypt = require('bcrypt')
const db = require('../config/connections')
const collection = require('../config/collections')
const { json } = require('express')
const { response } = require('../app')
const objectId = require('mongodb').ObjectId
const Razorpay = require('razorpay')
const { handlebars } = require('hbs')
const { resolve } = require('path')
let instance = new Razorpay({
    key_id: 'rzp_test_HFuZml3EB4GknT',
    key_secret: 'Zhm3QJfvVbGrEfettLaQaeWg',
});

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
                    db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId), 'products.item': objectId(proId) }, { $inc: { 'products.$.quantity': 1 } }).then(() => {
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
                        quantity: '$products.quantity'
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()
            // console.log(cartItems);
            // console.log(cartItems.products);
            resolve(cartItems)
        })
    },

    getCartCount: (userId) => {
        // console.log(userId+".......................looking for cartcount");
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            // console.log(cart+'>>>>>>>>>>cart');
            if (cart) {
                count = cart.products.length
                // console.log(count);
            } else {
                count = 0
            }
            resolve(count)
        })
    },

    changeQuantity: (data) => {
        count = parseInt(data.count)

        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(data.cart), 'products.item': objectId(data.product) },
                {
                    $inc: { 'products.$.quantity': count }
                })
                .then((response) => {
                    // console.log(response);
                    resolve({ status: true })
                })
        })
    },

    removeCartItem: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION).updateOne({ _id: objectId(data.cart), 'products.item': objectId(data.product) },
                {
                    $pull: { products: { item: objectId(data.product) } }
                })
                .then((response) => {
                    resolve({ removeProduct: true })
                })
        })
    },

    getTotalAmount: (userId) => {

        return new Promise(async (resolve, reject) => {
            let totalAmount = await db.get().collection(collection.CART_COLLECTION).aggregate([

                {
                    $match: { user: objectId(userId) }
                },

                {
                    $unwind: '$products'
                },

                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
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
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        //product price gets string when edited
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }

            ]).toArray()

            if (totalAmount.length == 0) {
                resolve(totalAmount)

            } else {
                resolve(totalAmount[0].total)

            }

        })
    },

    gerCartProList: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            resolve(cart.products)
        })
    },

    placeOrder: (order, products, total) => {
        return new Promise(async (resolve, reject) => {
            // console.log(order, products, total + "<<<<<<<<<<<<<<<<<<<<<placeorder");
            let status = order.Pay_Method === 'COD' ? 'placed' : 'pending'
            let orderObj = {

                Name: order.First_Name + ' ' + order.Last_Name,

                deliveryDetails: {
                    Company_Name: order.Company_Name,
                    Street_Address: order.Street_Address,
                    Extra_Details: order.Extra_Details,
                    Town_City: order.Town_City,
                    Country_State: order.Country_State,
                    Post_Code: order.Post_Code
                },

                Phone: {
                    Phone: order.Phone,
                    Alt_Phone: order.Alt_Phone,
                },

                Pay_Method: order.Pay_Method,
                UserId: objectId(order.userId),
                Products: products
                ,
                Total_Amount: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: objectId(order.userId) })
                resolve(response.insertedId)
            })
        })
    },

    generateRazorpay: (orderId, totalAmount) => {
        return new Promise((resolve, reject) => {
            let options = {
                amount: totalAmount,// amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("new order", order);
                    resolve(order)
                }
            });
        })
    },

    getViewOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ UserId: objectId(userId) }).toArray()
            resolve(orders)
            // console.log(orders);
            // console.log('orders from fetch');
        })
    },



    orderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
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
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()

            resolve(orderItems)
            console.log(orderItems + ">>>>>>>itemsfromfetch");

        })
    },

    verifyPayment: (data) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'Zhm3QJfvVbGrEfettLaQaeWg');

            hmac.update(data['payment[razorpay_order_id]'] + '|' + data['payment[razorpay_payment_id]'])
            hmac = hmac.digest('hex')
            if (hmac == data['payment[razorpay_signature]']) {
                resolve()
            } else {
                reject()
            }

        })
    },

    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
            {
                $set: {
                    status: 'placed'
                }
            })
            .then(() => {
                resolve()
            })
        })
    }



}