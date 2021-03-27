const MockDataForActiveEntity = {
  externalIdentifier: '',
  templateId: '',
  language: 'EN',
  productCategory: '',
  createdBy: 'value',
  createdOn: 'value',
  lastUpdatedOn: 'value',
  assignedTaxanomyIDs: [],
  properties: {
    name: 'value',
    thumbnailURL: '',
    description: 'value',
    details: 'value',
    price: 'value',
    care_and_handling: 'value',
    size_chart_ID: 'should be imageURL for easy rendering in UI',
    brand: [
      'tagId_1',
      'tagId_2',
    ],
    collection: [
      'tagId_1',
      'tagId_2',
    ],
  },
  additionalProperties: {
    attrId1: 'value',
    attrId2: 'value',
  },
  associations: {
    productsYouMayLike: [
      'IDsofProducts',
    ],
    relatedAssets: [
      'IDsofAssets',
    ],
  },
  variants: [
    {
      color: [
        'Blue',
        'Red',
      ],
      size: [
        'S',
      ],
      attr1: 'valueX',
      attr2: 'valueY',
      relatedAssets: [
        'assetID3',
      ],
    },
    {
      color: [
        'black',
      ],
      size: [
        'XXL',
      ],
      attr1: 'valueXX',
      attr2: 'valueXY',
      relatedAssets: [
        'assetID1',
        'assetID5',
      ],
    },
  ],
};
export default MockDataForActiveEntity;
