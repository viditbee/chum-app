const MockResponseForMakeup = {
  makeupId: 11,
  makeupName: 'Mizzles Fashionista',
  creativeBrief: 'Sample creative brief',
  baseProductId: '123',
  thumbnailAssetId: '',
  associatedContexts: [
    {
      contextType: 'persona',
      values: [],
    },
  ],
  importance: '2', // possibe values 1-medium, 2-high, 0-low
  createdBy: '',
  createdOn: '',
  lastModifiedOn: '',
  lastModifiedBy: '',
  languageCode: 'EN',
  contextualizedProperties: {
    baseProductAttributeName: 'contextualizeValue',
  },
  associatedDigitalAssets: ['assetIds'],
  activeFrom: -1, // -1 for "asap", null for "not sure yet"
  status: 'To do',
};

module.exports = MockResponseForMakeup;
