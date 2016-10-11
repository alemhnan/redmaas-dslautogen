'use strict';

const Promise = require('bluebird');
const parseSchema = Promise.promisify(require('mongodb-schema'));
const mongoConnect = Promise.promisify(require('mongodb').MongoClient.connect);
const _ = require('lodash');
const dslUtils = require('./dslStringify.js');

function queryToDSL(dbCollection) {
    return parseSchema(dbCollection.find())
        .then(schema => {
            const collectionObj = {
                table: dbCollection.s.name,
                label: dbCollection.s.name,
                sortby: _(schema.fields).first().name,
                order: 'asc',
                query: '',
                columns: [],
                actions: [{
                    Export: true,
                }]
            };

            _(schema.fields).each((val) => {
                collectionObj.columns.push({
                    name: val.name,
                    label: val.name,
                    type: val.type,
                });
            });
            return dslUtils.getCollection(collectionObj);
        })
        .catch(err => {
            console.log(err)
            throw err;
        });
}


function DbCollectionToDSL(dbConnection, collectionName) {
    let db = null;
    return mongoConnect(dbConnection)
        .then(dbObj => {
            db = dbObj;
            return queryToDSL(db.collection(`${collectionName}`))
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


function DbToDSL(dbConnection) {
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
                    return queryToDSL(item);
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
};