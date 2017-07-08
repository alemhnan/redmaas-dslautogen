const Promise = require('bluebird');
const parseSchema = Promise.promisify(require('mongodb-schema'));
const mongoConnect = Promise.promisify(require('mongodb').MongoClient.connect);
const _ = require('lodash');
const dslUtils = require('./dslStringify.js');

function queryToDSL(dbCollection, options) {
    return parseSchema(dbCollection.find())
        .then(schema => {
            const collectionObj = _.extend({
                table: dbCollection.s.name,
                label: dbCollection.s.name,
                sortby: (_(schema.fields).size() ? _(schema.fields).first().name : ''),
                order: 'asc',
                query: '',
                columns: [],
                actions: [{
                    Export: true,
                }],
                dsl: null,
            }, options)
            _(schema.fields).each((val) => {
                collectionObj.columns.push({
                    name: val.name,
                    label: val.name,
                    type: val.type,
                });
            });
            collectionObj.dsl = dslUtils.getCollection(collectionObj);
            return collectionObj;
        })
        .catch(err => {
            console.log(err)
            throw err;
        });
}


function DbCollectionToDSL(dbConnection, collectionName, options) {
    let db = null;
    return mongoConnect(dbConnection)
        .then(dbObj => {
            db = dbObj;
            return queryToDSL(db.collection(`${collectionName}`), options)
        })
        .then(dsl => {
            return dsl;
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
        .finally(() => {
            if (db) {
                db.close();
            }
        });
}

const getCollectionNames = (mongodbUrl, options) => {
    let db;
    return mongoConnect(mongodbUrl)
        .then(_db => {
            db = _db;
            return db.collections();
        })
        .then((collections) => _(collections)
            .filter((item) => !_.includes(item.s.name, 'system.index'))
            .filter((item) => !_.includes(item.s.name, 'objectlabs-system.admin.collections'))
            .filter((item) => !_.includes(item.s.name, 'objectlabs-system'))
            .map(item => item.s.name)
            .value())
        .finally(() => {
            if (db) {
                db.close();
            }
        });
};

function DbToDSL(dbConnection, options) {
    let db = null;
    return mongoConnect(dbConnection)
        .then(dbObj => {
            db = dbObj;
            return db.collections();
        })
        .then(collections => {
            const qCollections = _(collections)
                .filter((item) => {
                    return !_.includes(item.s.name, 'system.index');
                })
                .map((item) => {
                    return queryToDSL(item, options);
                })
                .value();
            return Promise.all(qCollections);
        })
        .then(dslList => {
            return dslList
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
        .finally(() => {
            if (db) {
                db.close();
            }
        });
}

module.exports = {
    DbCollectionToDSL,
    DbToDSL,
    getCollectionNames
};