const { MockDataForTags } = require('./mock-referenced-data');

const getTagsValuesByGroupIds = (tagGroupIds) => {
  const res = {};
  tagGroupIds.forEach((groupId) => {
    res[groupId] = MockDataForTags[groupId];
  });

  return res;
};

const dummy = () => {};

module.exports = {
  getTagsValuesByGroupIds,
  dummy,
};
