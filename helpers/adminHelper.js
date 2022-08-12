const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
const { response } = require('../app');
// const { BulkCountryUpdatePage } = require('twilio/lib/rest/voice/v1/dialingPermissions/bulkCountryUpdate');
// const { ObjectID } = require('bson');
const objectId = require('mongodb').ObjectId

module.exports = {
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            const adminInfo = {}
            const admin = await db.get().collection(collection.ADMIN_COLLECTIONS).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((data) => {
                    if (data) {
                        adminInfo.isAdminValid = true
                        adminInfo.admin = admin
                        resolve(adminInfo)
                    } else {
                        adminInfo.isAdminValid = false
                        adminInfo.err = "Email & password doesn't match"
                        resolve(adminInfo)
                    }
                })
            } else {
                adminInfo.isAdminValid = false
                resolve(adminInfo)
            }
        })
    },

    viewUsers: () => {
        return new Promise((resolve, reject) => {
            let users = db.get().collection(collection.USER_COLLECTIONS).find().toArray()
            resolve(users)
        })
    },

    blockUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTIONS).findOne({ _id: objectId(userId) }).then((res) => {
                if (res.block) {
                    db.get().collection(collection.USER_COLLECTIONS).updateOne({ _id: objectId(userId) }, { $set: { block: false } }).then((res) => {
                        resolve(res)
                    })
                } else {
                    db.get().collection(collection.USER_COLLECTIONS).updateOne({ _id: objectId(userId) }, { $set: { block: true } }).then((res) => {
                        resolve(res)
                    })
                }
            })
        })
    },

    // unBlockUser : (userId) => {
    //     return new Promise(async(resolve, reject) => {
    //         await db.get().collection(collection.USER_COLLECTIONS).updateOne({_id : objectId(userId)}, {$set : {block : false}}).then((res) => {
    //             resolve(res)
    //         })
    //     })
    // }


    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ UserId: objectId(userId) }).toArray()
            console.log(orders);
            resolve(orders)
            // console.log(orders);
            // console.log('orders from fetch');
        })
    },

    getOrderProducts: async (orderId) => {
        console.log(orderId);
        return new Promise(async (resolve, reject) => {
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$Products'
                },
                {
                    $project: {
                        item: '$Products.item',
                        quantity: '$Products.quantity'
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
            console.log(orderItems);
            resolve(orderItems)


        })
    },

    changeStatus: (orderId, newStatus) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        status: newStatus
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },

    getCoupons: () => {
        return new Promise(async (resolve, reject) => {
            let coupons = await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
            resolve(coupons)
        })
    },

    generateCoupon: (couponData) => {
        const oneDay = 1000 * 60 * 60 * 24
        let couponObj = {
            Name: couponData.name.toUpperCase(),
            Offer: parseFloat(couponData.offer / 100),
            validity: new Date(new Date().getTime() + (oneDay * parseInt(couponData.validity)))
        }
        return new Promise((resolve, reject) => {

            db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((result) => {
                if (result[0] == null) {

                    db.get().collection(collection.COUPON_COLLECTION).createIndex({ "Name": 1 }, { unique: true })

                    db.get().collection(collection.COUPON_COLLECTION).createIndex({ "Validity": 1 }, { expireAfterSeconds: 0 })

                    db.get().collection(collection.COUPON_COLLECTION).insertOne(couponObj).then((response) => {
                        resolve(response)
                    })
                } else {
                    db.get().collection(collection.COUPON_COLLECTION).insertOne(couponObj).then((response) => {
                        resolve(response)
                    })
                }
            })
        })
    },

    deleteCoupon: (couponId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({ _id: objectId(couponId) }).then((response) => {
                resolve()
            })
        })
    }
}

