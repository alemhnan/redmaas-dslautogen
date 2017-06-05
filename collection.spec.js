var js = {
  collection: {
    table: 'Customers',
    label: 'Junior Customers',
    id: '_id',
    sortby: 'name',
    query: { age: { $lt: 40 } },
    columns: [{
      name: "age",
      format: "%s years",
      validate: "%s < 100",
    }],
    actions: [
      { SendEmail: true, },
      { Export: true, },
    ],
    document: {
      label: 'prova',

      rows: [{
        name: "name",
        format: "Mr. %s",
        validate: "size(%s) > 10",
      },
      {
        name: "age",
        format: "%d years",
        validate: "%d < 100",
      }],
    }
  },
}
