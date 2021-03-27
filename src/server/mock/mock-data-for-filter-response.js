const MockDataForFilterableProperties = ['optimisationStatus', 'colour', 'brand'];

const MockDataForReferencedTags = {
  properties: {
    optimisationStatus: {
      label: 'Optimisation Status',
      values: {
        highlyOptimised: 'Highly Optimised',
        someOptimisation: 'Some Optimisation',
        noOptimisation: 'No Optimisation',
      },
    },
    colour: {
      label: 'Colour',
      values: {
        red: 'Red',
        blue: 'Blue',
        green: 'Green',
      },
    },
    brand: {
      label: 'Brand',
      values: {
        nike: 'Nike',
        polo_ralph_lauren: 'Polo Ralph Lauren',
        levis: 'Levi Strauss & Co',
      },
    },
  },
};

module.exports = {
  MockDataForFilterableProperties,
  MockDataForReferencedTags,
};
