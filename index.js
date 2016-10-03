'use strict';

const getLink = (data) =>
  `link(
   \tlabel: "${data.text}"
)\n`;

const getImage = (data) =>
  `image(
   \theight: "${data.height}"
   \twidth: "${data.width}"
)\n`;

const getRow = (data) =>
  `\trow(
  \t\tname: "${data.name}",
  \t\tlabel: "${data.label}",
  \t\ttype: "${data.type}"
\t)\n`;

const getArrayRows = (data) => {
  let finalRow = '';
  rows.forEach((value) => finalRow += value)
  return finalRow;
};

const getColumn = (data) =>
  `\tcolumn(
  \t\tname: "${data.name}",
  \t\tlabel: "${data.label}",
  \t\ttype: "${data.type}
)`;

const getArrayColumns = (data) => {
  let finalColumn = '';
  columns.forEach((value) => finalColumn += value)
  return finalColumn;
};

const getDocument = (data) =>
  `Document ( 
  \ttable:  "${data.table}",
  \tlabel:  "${data.label}",
  \tsortby: "${data.sortby}",
  \torder:  "${data.order}",
  \tquery:  "${data.query}"
) {
${getArrayRows(data)}
}`;

const getCollection = (data) =>
  `Collection(
  \ttable:   "${data.table}",
  \tlabel:   "${data.label}",
  \tsortby:  "${data.sortby}",
  \torder:   "${data.order}",
  \tquery:   "${data.query}",
  \tperpage: "${data.perpage}"
) {
${getArrayColumns(data)}
${getDocument(data)}
}`;

////////////////////////////

const rows = [];
rows.push(getRow({ name: 'surname', label: 'Surname', type: 'string' }));
rows.push(getRow({ name: 'name', label: 'Name', type: 'string' }));

const columns = [];
columns.push(getColumn({ name: 'surname', label: 'Surname', type: 'string' }));
columns.push(getColumn({ name: 'name', label: 'Name', type: 'string' }));

const dataDocument = {
  table: 'users',
  label: 'MyUsers',
  sortby: 'surname',
  order: 'asc',
  query: '{ age : { $lt : 40 } }',
  rows,
};

const dataCollection = {
  table: 'customers',
  label: 'JuniorCustomers',
  perpage: '20',
  sortby: 'surname',
  order: 'asc',
  query: '{ age: { $lt: 40} }',
  columns,
  document: dataDocument
};

// console.log(getArrayRows(rows));
// console.log(getDocument(dataDocument));
console.log(getCollection(dataCollection))

