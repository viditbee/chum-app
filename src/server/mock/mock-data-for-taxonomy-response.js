const MockDataForTaxonomyResponse = {
  taxonomyList: [
    {
      taxonomyId: 'running',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [
        {
          taxonomyId: 'clothing',
          parentTaxonomyId: 'running',
          taxonomyDesc: '',
          children: [
            {
              taxonomyId: 'shorts',
              parentTaxonomyId: 'clothing',
              taxonomyDesc: '',
              children: [],
            },
            {
              taxonomyId: 'pants',
              parentTaxonomyId: 'clothing',
              taxonomyDesc: '',
              children: [],
            },
            {
              taxonomyId: 'shirts',
              parentTaxonomyId: 'clothing',
              taxonomyDesc: '',
              children: [],
            },
          ],
        },
        {
          taxonomyId: 'shoes',
          parentTaxonomyId: 'running',
          taxonomyDesc: '',
          children: [
            {
              taxonomyId: 'boots',
              parentTaxonomyId: 'shoes',
              taxonomyDesc: '',
              children: [],
            },
            {
              taxonomyId: 'flats',
              parentTaxonomyId: 'shoes',
              taxonomyDesc: '',
              children: [],
            },
          ],
        },
        {
          taxonomyId: 'handbags',
          parentTaxonomyId: 'running',
          taxonomyDesc: '',
          children: [
            {
              taxonomyId: 'backpacks',
              parentTaxonomyId: 'handbags',
              taxonomyDesc: '',
              children: [],
            },
          ],
        },
      ],
    },
    {
      taxonomyId: 'golf',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [
        {
          taxonomyId: 'equipment',
          parentTaxonomyId: 'golf',
          taxonomyDesc: '',
          children: [
            {
              taxonomyId: 'balls',
              parentTaxonomyId: 'equipment',
              taxonomyDesc: '',
              children: [],
            },
            {
              taxonomyId: 'putters',
              parentTaxonomyId: 'equipment',
              taxonomyDesc: '',
              children: [],
            },
          ],
        },
        {
          taxonomyId: 'accessories',
          parentTaxonomyId: 'golf',
          taxonomyDesc: '',
          children: [
            {
              taxonomyId: 'iron',
              parentTaxonomyId: 'accessories',
              taxonomyDesc: '',
              children: [],
            },
          ],
        },
      ],
    },
    {
      taxonomyId: 'basketball',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [],
    },
    {
      taxonomyId: 'softball',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [],
    },
    {
      taxonomyId: 'volleyball',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [],
    },
    {
      taxonomyId: 'training',
      parentTaxonomyId: '',
      taxonomyDesc: '',
      children: [],
    },
  ],
};

module.exports = MockDataForTaxonomyResponse;
