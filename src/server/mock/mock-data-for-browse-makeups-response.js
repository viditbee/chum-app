const MockDataForBrowseMakeupsResponse = {
  cursor: 0,
  totalContents: 2,
  contents: [
    {
      makeupId: '123',
      makeupName: 'Celebrity based content',
      defaultAssetInstanceId: '',
      status: 'Live',
      associatedContexts: [
        {
          contextType: 'persona',
          values: ['fashionista_fiona', 'repeat_robert'],
        },
      ],
      languageCode: 'EN',
      isPriority: false,
    },
    {
      makeupId: '1234',
      makeupName: 'Waterproof runners',
      imageUrl: '',
      status: 'Live',
      isPriority: true,
      associatedContexts: [
        {
          contextType: 'persona',
          values: ['fashionista_fiona', 'repeat_robert'],
        },
      ],
      languageCode: 'EN',
    },
    {
      makeupId: '12345',
      makeupName: 'Beach Focused Content',
      imageUrl: '',
      status: 'Live',
      isPriority: false,
      associatedContexts: [
        {
          contextType: 'persona',
          values: ['fashionista_fiona', 'repeat_robert'],
        },
      ],
      languageCode: 'EN',
    },
  ],
};

module.exports = MockDataForBrowseMakeupsResponse;
