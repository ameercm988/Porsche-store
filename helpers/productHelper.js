const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
const objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (newProduct, productImages) => {

        newProduct.price = parseInt(newProduct.price)
        return new Promise((resolve, reject) => {
                db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne({
                    name: newProduct.name,
                    price: newProduct.price,
                    description: newProduct.description,
                    category: newProduct.category,
                    productImages,
                    deletedItem: false
                }).then((data) => {
                    resolve(data.insertedId)
                }).catch((err) => {
                    reject(err)
                })
        })
    },

    getAllProducts: () => {

        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find({ deletedItem: false }).toArray()
            resolve(products)
        })
    },

    getAllMenProducts : () => {

        return new Promise(async (resolve, reject) => {
            let menProducts = await db.get().collection(collection.PRODUCT_COLLECTIONS).find({ category: "MEN" }).toArray()
            resolve(menProducts)
        })
    },

    getAllWomenProducts : () => {

        return new Promise(async (resolve, reject) => {
            let womenProducts = await db.get().collection(collection.PRODUCT_COLLECTIONS).find({ category: "WOMEN" }).toArray()
            resolve(womenProducts)
        })
    },

    editProducts: (proId) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({ _id: objectId(proId) }).then((res) => {
                resolve(res)
            })
        })
    },

    updateProducts: (proId, proInfo, newImages) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId) }, {
                $set: {
                    name: proInfo.name,
                    price: proInfo.price,
                    description: proInfo.description,
                    category: proInfo.category,
                    productImages : newImages
                }
            }).then((data) => {
                resolve(data.insertedId)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId) }, { $set: { deletedItem: true } }).then((res) => {
                resolve(res)
            })
        })
    },

    
    getViewProduct : (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id: objectId(proId)}).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    },


}