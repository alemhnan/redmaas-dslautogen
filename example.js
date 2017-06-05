const generator = require('./dslGenerator.js');

const dbString = 'mongodb://localhost:27017/redmongo';
const collectionName = 'user';

generator
    .DbCollectionToDSL(dbString, collectionName, { actions: [{ Exports: false }] })
    .then(dsl => console.log(dsl));

generator
    .DbToDSL(dbString, { actions: [{ Exports: false }] })
    .then(dslList => console.log(dslList.length));