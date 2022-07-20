const db = require('../config/connections')
const bcrypt = require('bcrypt')
const collection = require('../config/collections');

module.exports = {
    addProduct : (newProduct) => {
        console.log(newProduct);
        newProduct.price = parseInt(newProduct.price)
        return new Promise(async(resolve, reject) => {
           await db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne(newProduct).then((data) => {
                resolve(data.insertedId)
                console.log(data+"database"+data.insertedId);

            }).catch((err) => {
                reject(err)
            })
        })
    },
    getAllProducts : () => {
        return new Promise(async(resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
                resolve(products)
        })
    }
}