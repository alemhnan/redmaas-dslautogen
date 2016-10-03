'use strict';

var parseSchema = require('mongodb-schema');
// var connect = require('mongodb');
var client = require('mongodb').MongoClient;
var _ = require('lodash');
var dslUtils = require('./index.js');

function toDSLType(mongoType, capital){
  const typeMap ={
    ObjecID: 'string',
    String: 'string',
    Document: 'object',
    Boolean: 'string',
    Null: 'string'
  }
  console.log(capital?true:false);
  return capital? _.capitalize(typeMap[mongoType] || 'string'): typeMap[mongoType] || 'string';//`not valid ${mongoType}`;
}

client.connect('mongodb://localhost:27017/maas', function(err, db) {
    if (err) return console.error(err);

    // here we are passing in a cursor as the first argument. You can 
    // also pass in a stream or an array of documents directly. 

    // db.collections()
    // .then(function(collections){
    //   console.log(collections);

    //   db.close();
    // });
    // const dataCollection = {
    //   table: 'customers',
    //   label: 'JuniorCustomers',
    //   perpage: '20',
    //   sortby: 'surname',
    //   order: 'asc',
    //   query: '{ age: { $lt: 40} }',
    //   columns,
    //   document: dataDocument
    // };

    const collectionName = 'user';
    const collection = {};
    const metadataDataCollection = {
        order: ''
    };
    const metadataDataDocument = {};
    parseSchema(db.collection(collectionName).find(), function(err, schema) {
        if (err) return console.error(err);


        collection.table = collectionName;
        collection.label = collectionName;
        collection.sortby = schema.fields[0].name;
        collection.order = 'asc';
        collection.query = '';
        collection.columns = [];
        collection.actions = [{
          Export: true,
        }];

        _.each(schema.fields, (val) => {
            collection.columns.push({
                name: val.name,
                label: val.name,
                type : val.type,
            })


        });

        console.log(dslUtils.getCollection(collection));
        // console.log(JSON.stringify(schema, null, 2));
        db.close();
    });
});