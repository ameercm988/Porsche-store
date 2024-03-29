const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
const { response } = require('../app');
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

        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTIONS).find().toArray()
            resolve(users.reverse())
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

    getrecentOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders.reverse())
        })
    },

    getRevenue: () => {
        return new Promise(async (resolve, reject) => {
            let deliveredRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                {
                    $match: { "status": "Delivered" }
                },

                {
                    $group: {
                        _id : null,
                        total: { $sum: '$orderData.Total_Amount' }
                    }
                }

            ]).toArray()

            deliveredRevenue = deliveredRevenue[0]?deliveredRevenue[0].total:0

            let discountRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match : { "status" : "Delivered" }
                },
                
                {
                    $group : {
                        _id : null,
                        total : { $sum : "$orderData.discountData.discount"}
                    }
                }           
            ]).toArray()
            discountRevenue = discountRevenue[0]?discountRevenue[0].total:0

            let totalRevenue = deliveredRevenue - discountRevenue

            resolve(totalRevenue)
        })
    },

    getActiveUsers : () => {
        return new Promise(async(resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTIONS).count({block : false})
            resolve(users)
        })
    },

    getOrderStatus : () => {
        
        return new Promise( async (resolve, reject) => {
            let delivered = await db.get().collection(collection.ORDER_COLLECTION).count({status : "Delivered"})
            let packed = await db.get().collection(collection.ORDER_COLLECTION).count({status : "Packed"})
            let shipped = await db.get().collection(collection.ORDER_COLLECTION).count({status : "shipped"})
            let cancelled = await db.get().collection(collection.ORDER_COLLECTION).count({status : "Cancelled"})

            statusData = {
                delivered : delivered,
                packed : packed,
                shipped : shipped,
                cancelled : cancelled,
            }
            resolve(statusData)
        })
    },

    getPayMethod : () => {
        return new Promise(async(resolve, reject) =>  {
            let cod = await db.get().collection(collection.ORDER_COLLECTION).count({Pay_Method : "COD"})
            let razorPay = await db.get().collection(collection.ORDER_COLLECTION).count({Pay_Method : "Razorpay"})

            let payData = {
                cod : cod,
                razorPay : razorPay
            }
            
            resolve(payData)
        })
    },

    getUserOrders: (userId) => {

        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ UserId: objectId(userId) }).toArray()
            resolve(orders.reverse())
        })
    },

    // getOrderProducts: (orderId) => {

    //     return new Promise(async (resolve, reject) => {
    //         let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
    //             // {
    //             //     $match: { _id: objectId(orderId) }
    //             // },
    //             // {
    //             //     $unwind: '$Products'
    //             // },
    //             // {
    //             //     $project: {
    //             //         item: '$Products.item',
    //             //         quantity: '$Products.quantity'
    //             //     }

    //             // },
    //             // {
    //             //     $lookup: {
    //             //         from: collection.PRODUCT_COLLECTIONS,
    //             //         localField: 'item',
    //             //         foreignField: '_id',
    //             //         as: 'product'
    //             //     }

    //             // },
    //             // {
    //             //     $project: {
    //             //         item: 1,
    //             //         quantity: 1,
    //             //         product: { $arrayElemAt: ['$product', 0] }
    //             //     }
    //             // }


    

    //             {
    //                 $match: { _id: objectId(orderId) }
    //             },
    //             {
    //                 $unwind: '$Products'
    //             },
    //             {
    //                 $project: {
    //                     item: '$Products.item',
    //                     quantity: '$Products.quantity',
    //                     name: '$Name',
    //                     date: '$date',
    //                     status: '$status',
    //                     amount: '$orderData.Total_Amount',
    //                     discount: '$orderData.discountData',
    //                     invoice: '$invoiceNumber'


    //                 }

    //             },
    //             {
    //                 $lookup: {
    //                     from: collection.PRODUCT_COLLECTIONS,
    //                     localField: 'item',
    //                     foreignField: '_id',
    //                     as: 'product'
    //                 }

    //             },
    //             {
    //                 $project: {
    //                     item: 1,
    //                     quantity: 1,
    //                     name: 1,
    //                     product: { $arrayElemAt: ['$product', 0] },
    //                     date: 1,
    //                     status: 1,
    //                     amount: 1,
    //                     discount: 1,
    //                     invoice: 1

    //                 }
    //             }

    //         ]).toArray()
    //         resolve(orderItems)
    //     })
    // },

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
            validity: new Date(new Date().getTime() + (oneDay * parseInt(couponData.validity))).toLocaleString(),
            valDays: couponData.validity

        }
        return new Promise((resolve, reject) => {

            db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((result) => {
                if (result[0] == null) {

                    db.get().collection(collection.COUPON_COLLECTION).createIndex({ "Name": 1 }, { unique: true })

                    db.get().collection(collection.COUPON_COLLECTION).createIndex({ "validity": 1 }, { expireAfterSeconds: 0 })

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

