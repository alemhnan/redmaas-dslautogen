// TODO: fix
// in collection-> doc->row fields of type boolean work only with type object
// in collection-> doc->row fields types are only lower case in columns only uppercase
// in collection-> doc->row _id field does not work
// use command node parse-schema.js | pbcopy


'use strict';

const toDSLType = (mongoType, capital) => {
    const typeMap = {
        ObjecID: 'string',
        String: 'string',
        Document: 'object',
        Boolean: 'object',
        Null: 'string'
    }
    return capital ? _.capitalize(typeMap[mongoType] || 'string') : typeMap[mongoType] || 'string'; //`not valid ${mongoType}`;
}


const _ = require('lodash');

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

const getRow = (data,i) =>
    `
  \t\trow(
  \t\t name: "${data.name}",
  \t\t label: "${data.label}",
  \t\t type: "${toDSLType(data.type, false)}"
  \t\t)
  `;

const getArrayRows = (data) => {
    let finalRow = '';
    _.each(data.columns, (row) => {
        if(!_.includes(row.name, '_id')){
            finalRow += getRow(row)
        }
        
    });
    // data.rows.forEach((value) => finalRow += value);
    return finalRow;
};

const getColumn = (data,i) =>
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
    _.each(data.columns, (value, i) => finalColumn += getColumn(value,i))
        // data.columns.forEach((value) => finalColumn += value)
    return finalColumn;
};

const getDocument = (data) => {
    return `
    Document ( 
    \t) {
        ${getArrayRows(data)}
    }`
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
\t) {
${getArrayColumns(data)}
${getDocument(data)}
}`;

////////////////////////////








// const rows = [];
// rows.push(getRow({ name: 'surname', label: 'Surname', type: 'string' }));
// rows.push(getRow({ name: 'name', label: 'Name', type: 'string' }));

// const columns = [];
// columns.push(getColumn({ name: 'surname', label: 'Surname', type: 'string' }));
// columns.push(getColumn({ name: 'name', label: 'Name', type: 'string' }));

// const dataDocument = {
//   table: 'users',
//   label: 'MyUsers',
//   sortby: 'surname',
//   order: 'asc',
//   query: '{ age : { $lt : 40 } }',
//   rows,
// };

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

// console.log(getArrayRows(rows));
// console.log(getDocument(dataDocument));
// console.log(getCollection(dataCollection));
module.exports = {
    getCollection,
    getDocument,
};