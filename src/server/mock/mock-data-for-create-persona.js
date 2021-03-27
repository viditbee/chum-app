const MockDataForCreatePersona = {
  personaId: 'persona_1',
  personaName: 'Alex',
  language: 'EN',
  createdBy: 'user_name',
  createdOn: 123,
  lastUpdatedOn: 456,
  personaDescription: 'asdf',
  associatedDigitalAssets: ['q'],
  tags: {
    customer_segments: [
      'tagId_1',
      'tagId_2',
    ],
    age_group: [
      'tagId_1',
      'tagId_2',
    ],
  },
  personaAffinites: {
    productAffinity: {
      product_tagId_1: 1,
      product_tagId_2: 0,
    },
    sportsAffinity: {
      sport_tagId_1: 2,
      sport_tagId_2: 1,
    },
  },
  additionalProperties: {
    attrId1: 'AA',
    attrId2: 'BB',
  },
};

const MockDataForTargetReferencedData = {
  affinities: [
    {
      affinityId: 'productsAffinities',
      values: ['affLowRange', 'affMidRange', 'affHighRange'],
    },
    {
      affinityId: 'sportsAffinities',
      values: ['affRunning', 'affBasketball', 'affBadminton', 'affIceHockey'],
    },
  ],
};

module.exports = {
  MockDataForCreatePersona,
  MockDataForTargetReferencedData,
};
