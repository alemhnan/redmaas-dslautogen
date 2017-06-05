var js = {
  document: {
    label: 'prova',
    //omit select when document is nested
    select: {
      query: { $eq: { email: 'ale@redbabel.com' } },
      sortby: 'email',
    },
    fields: [{
      name: "name",
      label: 'Name',
      type: 'string',
      format: "Mr. %s",
      validate: "size(%s) > 10",
    },
    //field can be an object
    {
      name: 'wifeId',
      label: 'wife',
      type: 'select',
      fktable: 'people',
      fkfield: 'id',
      fklabel: 'name',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'object',
      fields: [{
        name: "street",
        type: 'string',
        format: "size(%s) > 10",
        validate: "%s < 100",
      },
      {
        name: "apt",
        type: 'integer',
        format: "%d - %d",
        validate: "%d > 0",
      },
      {
        name: "city",
        type: 'string',
        format: "%s",
        validate: "size(%s) > 3",
      }]
    },
    {
      name: 'sons',
      type: 'array',

    }
    ],
  }
}