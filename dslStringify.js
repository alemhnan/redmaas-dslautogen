// TODO: fix
// in collection-> doc->row fields of type boolean work only with type object
// in collection-> doc->row fields types are only lower case in columns only uppercase
// in collection-> doc->row _id field does not work
// use command node parse-schema.js | pbcopy


'use strict';

const _ = require('lodash');

const toDSLType = (mongoType, capital) => {
    const type = _.toLower(mongoType);
    const typeMap = {
        undefined: 'string',
        objecid: 'string',
        boolean: 'object',
        date: 'string',
        null: 'string',
        regex: 'string',
        dbPointer: 'string',
        javascript: 'string',
        symbol: 'string',
        javascriptWithScope: 'string',
        int: 'number',
        integer: 'number',
        timestamp: 'number',
        long: 'number',
        minKey: 'number',
        maxKey: 'number',
        string: 'string',
        document: 'object',
    }
    return capital ? _.capitalize(typeMap[type] || 'string') : typeMap[type] || 'string'; //`not valid ${type}`;
}

const getLink = (data) =>
    `link(
   \tlabel: "${data.text}"
)
`;

const getImage = (data) =>
    `
  \timage(
  \t height: "${data.height}"
  \t width: "${data.width}"
  \t)
  `;

const getRow = (data, i) =>
    `
  \t   row(
  \t    name: "${data.name}",
  \t    label: "${data.label}",
  \t    type: "${toDSLType(data.type, false)}"
  \t   )
  `;

const getArrayRows = (data) => {
    let finalRow = '';
    _.each(data.columns, (row) => {
        if (!_.includes(row.name, '_id')) {
            finalRow += getRow(row)
        }

    });
    // data.rows.forEach((value) => finalRow += value);
    return finalRow;
};

const getColumn = (data, i) =>
    `
  \tcolumn(
  \t name: "${data.name}",
  \t label: "${data.label}",
  \t type: "${toDSLType(data.type, true)}",
  \t selectable: ${0===i? 'true': 'false'}
  \t)
  `;

const getArrayColumns = (data) => {
    let finalColumn = '';
    _.each(data.columns, (value, i) => finalColumn += getColumn(value, i))
        // data.columns.forEach((value) => finalColumn += value)
    return finalColumn;
};

const getCollectionDocument = (data) => {
    return `
    \tDocument (
         
    \t) {
        ${getArrayRows(data)}
    \t}`
};

const getCollection = (data) =>
    `
    Collection(
    \ttable:   "${data.table}",
    \tlabel:   "${data.label}",
    \tsortby:  "${data.sortby}",
    \torder:   "${data.order}",
    \tquery:   "${data.query}",
    \tperpage: 30
    ) {
        ${getArrayColumns(data)}
        ${getCollectionDocument(data)}
    }`;

module.exports = {
    getCollection,
};