const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');
const objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (newProduct) => {
        // console.log(newProduct);
        newProduct.price = parseInt(newProduct.price)
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne({ 
                name: newProduct.name,
                price: newProduct.price,
                description: newProduct.description,
                category: newProduct.category,
                deletedItem: false
            }).then((data) => {
                resolve(data.insertedId)
                // console.log(data+"   from database");


            }).catch((err) => {
                reject(err)
            })
        })
    },
    
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find({deletedItem: false }).toArray()
            resolve(products)
        })
    },

    editProducts : (proId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({ _id: objectId(proId) }).then((res) => {
                resolve(res)
            })
        })
    },

    updateProducts : (proId, proInfo) => {
        
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId)}, {$set : {
                name : proInfo.name,
                price : proInfo.price,
                description : proInfo.description,
                category : proInfo.category
            }}).then((res) => {
                resolve(res)
            })
        })
    },

    deleteProduct: (proId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTIONS).updateOne({ _id: objectId(proId) }, { $set: { deletedItem: true } }).then((res) => {
                resolve(res)
                // console.log(res+"  deleting page");
            })
        })
    }
}