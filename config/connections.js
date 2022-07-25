

const mongoClient = require('mongodb').MongoClient

const state = { db: null }

const connect = (callBack) => {

    const url = 'mongodb://localhost:27017'
    const dbname = 'PorscheStore'

    mongoClient.connect(url, (err, data) => {
        if (err) {
            return callBack(err)
        }
        state.db = data.db(dbname)
        callBack()
    })
}

module.exports.connect = connect;

module.exports.get = function () {
    return state.db
}