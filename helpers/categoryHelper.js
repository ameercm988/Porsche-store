const db = require('../config/connections')
const collection = require('../config/collections');
const { response } = require('express');
const objectId = require('mongodb').ObjectId

module.exports = {
    
    getAllCategory : () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((category) => {
                resolve(category)
            })
        })
    },

    addCategory : (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(data).then((response) => {
                resolve(response.insertedId)
            })
        })
    },

    editCategory : (catId) => {
        return new Promise((resolve, reject) => {
              db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id : objectId(catId)}).then((res) => {
                resolve(res)
             })       
        })
    },

    updateCategory : (catId,catInfo) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id : objectId(catId)}, {$set : {category : catInfo.category}}).then((data) => {
                resolve(data.insertedId)
            })
        })
    },

    deleteCategory : (catId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id : objectId(catId)}).then((response) => {
                resolve(response)
            })
        })
    }
}