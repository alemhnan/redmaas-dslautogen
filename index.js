const generator = require('./dslGenerator.js');

const dbString = 'mongodb://localhost:27017/maas';
const collectionName = 'user';
generator.DbCollectionToDSL(dbString, collectionName)
    .then(dsl => {
        console.log(dsl);
    });
generator.DbToDSL(dbString)
    .then(dslList => {
        console.log(dslList.length);
    });