/* eslint-disable */
const { v4 } = require('uuid');

const scoper = (() => {
  let counts = {};

  return {
    setCounts: (c) => {
      counts = c;
    },
    getCounts: () => counts,
  };
})();

const words = ['As', 'a', 'popular', 'local', 'politician', 'I', 'always', 'try', 'to', 'help', 'out', 'whenever', 'I', 'can', 'So', 'that’s', 'how', 'it', 'came', 'to', 'be', 'that', 'when', 'a', 'fellow', 'came', 'up', 'to', 'me', 'in', 'a', 'hotel', 'lobby', 'the', 'other', 'day', 'and', 'asked', 'me', 'for', 'a', 'small', 'favor', 'I', 'was', 'more', 'then', 'happy', 'to', 'oblige'];

const gimmeUUID = () => v4();

const gimmeShortUUID = () => gimmeUUID().split('-')[4];

const tossACoin = () => Math.random() > .5;

const gimmeArbitraryNumber = (min = 0, max = 9) => Math.floor(Math.random() * (max - min) + min);

const gimmeRandomWord = () => `${words[gimmeArbitraryNumber()]}_${words[gimmeArbitraryNumber()]}`;

const gimmeRandomSentence = (length = 10, wordToInject) => {
  const myWords = [];
  const injectAt = wordToInject ? gimmeArbitraryNumber(0, length) : null;

  for (let i = 0; i < length; i += 1) {
    myWords.push(words[gimmeArbitraryNumber(0, 49)]);
    if (i === injectAt) myWords.push(wordToInject);
  }

  let sentence = myWords.join(' ');
  sentence = sentence[0] ? sentence[0].toUpperCase() + sentence.substring(1) : '';
  return sentence;
};

const gimmeArbitraryCount = (path) => {
  const counts = scoper.getCounts();
  const length = counts[path] === 0 ? '0' : (counts[path] || counts.count) + "";
  const splits = length.split(',');
  const lower = splits[0] || 1;
  const upper = splits[1] || lower;

  return gimmeArbitraryNumber(+lower, +upper);
};

const gimmeArbitraryBoolean = () => tossACoin();

const gimmeRandomAny = (model, key = '', path = '') => {
  const newPath = key ? path ? `${path}_${key}` : key : path;

  switch (typeof model) {
    case 'string':
      return gimmeRandomStringByModel(model, newPath);

    case 'number':
      return gimmeArbitraryNumber(0, 9999);

    case 'boolean':
      return gimmeArbitraryBoolean();

    case 'object':
      if (Array.isArray(model)) {
        return gimmeRandomArrayByModel(model, newPath);
      }
      return gimmeRandomObjectByModel(model, newPath);
    default:
      return '';
  }
};

const gimmeRandomStringByModel = (model = '', path) => {
  const length = gimmeArbitraryCount(path);
  if (model === 'id') {
    return gimmeShortUUID();
  } else if (model[0] === "[" && model[model.length-1] === "]"){
    let arr = JSON.parse(model);
    return arr[gimmeArbitraryNumber(0, arr.length - 1)]
  } else if (model[0] === "~") {
    return gimmeRandomSentence(length, model.split("~")[1]);
  } else if (model.length) {
    return model;
  }
  return gimmeRandomSentence(length);
};

const gimmeRandomArrayByModel = (model, path) => {
  const firstItem = model[0] || '';
  let length = gimmeArbitraryCount(path);
  const returnArray = [];
  if (typeof firstItem === "object") {
    for (let i = 0; i < length; i += 1) {
      returnArray.push(gimmeRandomAny(firstItem, '', path));
    }
  } else if (model.length === 1) {
    if (model[0] === '') {
      for (let i = 0; i < length; i += 1) {
        returnArray.push(gimmeRandomWord());
      }
    } else if (length === 1 || tossACoin()) {
      returnArray.push(model[0]);
    }
  } else if (model.length > 1) {
    length = Math.min(model.length, length);
    for (let i = 0; i < length; i += 1) {
      returnArray.push(model[gimmeArbitraryNumber(0, model.length - 1)]);
    }
  }
  return returnArray;
};

const gimmeRandomObjectByModel = (model, path) => {
  const keys = Object.keys(model);
  const returnObj = {};
  const length = gimmeArbitraryCount(path);

  if (keys.length === 1 && keys[0] === '$') {
    for (let i = 0; i < length; i += 1) {
      returnObj[gimmeShortUUID()] = gimmeRandomAny(model.$, '$', path);
    }
  } else {
    for (let i = 0; i < keys.length; i += 1) {
      returnObj[keys[i]] = gimmeRandomAny(model[keys[i]], keys[i], path);
    }
  }

  return returnObj;
};

const templateA = {
  counts: {
    count: 2, // count of items (if array) and default count
    attributes: '2, 8', // variable counts can be given like this
    tags: 3,
    name: 5,
    tags_$: 4,
    custom_mixed_$: 5, // path at which count needs to be specified
  },
  model: { // wrap with square brackets to get array
    id: 'id', // 'id' as value determines the value should be a uuid
    name: '',
    attributes: {
      $: '',
    },
    tags: {
      $: ['id'], // $ for random key value (array in this case) pairs. Count is determined by path (i.e. "tags")
    },
    custom: [
      {
        id: 'id', // 'id' as value determines the value should be a uuid
        mixed: {
          $: {
            $: '', // $ for random key value pairs. Count is determined by path (i.e. "mixed_$_$")
          },
        },
      },
    ],
  },
};

const templateB = {
  counts: {
    count: '2,8', // variable counts can be given like this
    zep_name: '2,10',
  },
  model: [
    {
      zep: {
        name: '',
        disabled: false
      },
    },
  ],
};

const productInListTemplate = {
  counts: {
    name: '2,8',
    tags_optimisationStatus: 1,
    taxonomyIds: 1,
    taxonomyLabels: 1,
  },
  model: {
    id: 'id',
    name: '',
    assetUrl: '',
    baseType: '',
    createdOn: 0,
    lastUpdatedOn: 0,
    taxonomyIds: ['678a'],
    taxonomyLabels: ['Shoes'],
    extendedTaxonomyIds: [""],
    favourite: false,
    tags: {
      optimisationStatus: ['noOptimisation', 'highlyOptimised', 'someOptimisation'],
    }
  }
};

const singleProductTemplate = {
  counts: {
    name: '2,8',
    tags_optimisationStatus: 1,
    taxonomyIds: 1,
    taxonomyLabels: 1,
  },
  model: {
    externalId: "18282",
    templateId: "sample_template_1",
    language: "EN",
    createdBy: 123,
    createdOn: 1596455589589,
    lastUpdatedOn: 1596737264143,
    variants: [],
    assignedTaxonomyIds: ["18281"],
    productProperties: {
      sellPrice: 123,
      shortDescription: "The sporty Aami power stretch jacket from McKinley",
      collection: [],
      name: "Ladies Power Stretch Jacket \"Aami\"",
      details: "",
      thumbnailAssetId: "",
      productDescription: "Hood with elastic closure - mottled design with fine quilting seams",
      listPrice: 123
    },
    additionalProperties: {},
    associations: { productsYouMayLike: [""], relatedAssets: [""] }
  }
};

const productsTemplate = {
  counts: {
    count: 20,
    products: 20,
    products_name: '2,8',
    products_tags_optimisationStatus: 1,
    products_taxonomyIds: 1,
    products_taxonomyLabels: 1,
  },
  model: {
    languageId: 'en_US',
    count: 100,
    cursor: 0,
    products: [
      productInListTemplate.model
    ],
    referencedData: {
      tags: {
        optimisationStatus: {
          id: 'optimisationStatus',
          label: 'Optimisation Status',
          tagValues: {
            highlyOptimised: {
              id: 'highlyOptimised',
              label: 'Highly optimised',
            },
            someOptimisation: {
              id: 'someOptimisation',
              label: 'Some optimisation',
            },
            noOptimisation: {
              id: 'noOptimisation',
              label: 'No optimisation',
            },
          },
        },
      },
      taxonomies: {
        '678ae': {
          id: '678ae',
          label: 'Shoes',
        },
      },
    },
  }
};

function gimmeRandomData(t = productsTemplate) {
  scoper.setCounts(t.counts);
  return gimmeRandomAny(t.model);
}

function GetProducts(size, taxLabel, searchLabel, dataTemplate) {
  let template = dataTemplate || productsTemplate;

  if (size || taxLabel || searchLabel) {
    template = JSON.parse(JSON.stringify(template));
    size && (template.counts.products = size);
    taxLabel && (template.model.products[0].taxonomyLabels = [taxLabel]);
    searchLabel && (template.model.products[0].name = "~" + searchLabel);
    (searchLabel && searchLabel.toLocaleLowerCase() === "zero") && (template.counts.products = 0)
  }
  return gimmeRandomData(template);
}

function GetTarget(taxLabel, dataTemplate) {
  let template = dataTemplate || personaTemplate;

  if (taxLabel) {
    template = JSON.parse(JSON.stringify(template));
    taxLabel && (template.model.taxonomyLabels = [taxLabel]);
  }
  return gimmeRandomData(template);
}

function GetProductById(id) {
  let product = gimmeRandomData(singleProductTemplate);
  product.id = id;

  return product;
}

const userTemplate = {
  counts: {
    count: 1,
    imageUrl: 0,
  },
  model: {
    id: 'user',
    name: '',
    userName: '',
    imageUrl: '',
    contact: 0,
    email: '',
  }
};

function GetUser() {
  return gimmeRandomData(userTemplate);
}

const personaTemplate = {
  counts: {
    count: 1,
    personaName: '2,8',
    personaDescription: '10, 15',
    associatedDigitalAssets: 4,
    tags_customerSegment: 2,
    tags_ageGroup: 2,
    personaAffinities_productAffinity_$: 1,
    personaAffinities_productAffinity: 3,
    personaAffinities_sportsAffinity_$: 1,
    personaAffinities_sportsAffinity: 3,
    additionalProperties: 3,
  },
  model: {
    personaId: 'id',
    personaName: '',
    language: '',
    createdBy: 'admin',
    createdOn: 0,
    lastUpdatedOn: 2,
    personaDescription: '',
    associatedDigitalAssets: [''],
    tags: {
      customerSegment: [''],
      ageGroup: [''],
    },
    personaAffinities: {
      productAffinity: {
        $: [0, 1, 2, 3, 4]
      },
      sportsAffinity: {
        $: [0, 1, 2, 3, 4]
      },
    },
    additionalProperties: {
      $: '',
    },
  }
};

const eventTemplate = {
  count: {
    count: 1,
    eventDescription: '10, 15',
    associatedDigitalAssets: 4,
    tags_customerSegment: 2,
    tags_ageGroup: 2,
    eventAffinities_productAffinity_$: 1,
    eventAffinities_productAffinity: 3,
    eventAffinities_sportsAffinity_$: 1,
    eventAffinities_sportsAffinity: 3,
    additionalProperties: 3,
  },
  model: {
    eventId: '',
    eventName: '',
    language: '',
    createdBy: '',
    createdOn: 0,
    lastUpdatedOn: 123,
    eventDescription: '',
    associatedDigitalAssets: [''],
    startAt: 123,
    endAt: 456,
    repeat: 321,
    tags: {
      customerSegment: [''],
      ageGroup: [''],
    },
    eventAffinities: {
      productAffinity: {
        $: [0, 1, 2, 3, 4]
      },
      sportsAffinity: {
        $: [0, 1, 2, 3, 4]
      },
    },
    additionalProperties: {
      $: '',
    },
  }
};

const locationTemplate = {
  count: {
    count: 1,
    locationDescription: '10, 15',
    associatedDigitalAssets: 4,
    tags_customerSegment: 2,
    tags_ageGroup: 2,
    locationAffinities_productAffinity_$: 1,
    locationAffinities_productAffinity: 3,
    locationAffinities_sportsAffinity_$: 1,
    locationAffinities_sportsAffinity: 3,
    additionalProperties: 3,
  },
  model: {
    locationId: '',
    locationName: '',
    language: '',
    createdBy: '',
    createdOn: 0,
    lastUpdatedOn: 123,
    locationDescription: '',
    parentTargetId: '',
    geoAreaBox: {
      degrees: 1,
      minutes: 2,
      seconds: 3,
    },
    associatedDigitalAssets: [''],
    tags: {
      customerSegment: [''],
      ageGroup: [''],
    },
    locationAffinities: {
      productAffinity: {
        $: [0, 1, 2, 3, 4]
      },
      sportsAffinity: {
        $: [0, 1, 2, 3, 4]
      },
    },
    additionalProperties: {
      $: '',
    },
  },
};

function CreateTarget(targetType) {
  switch (targetType) {
    case 'persona':
      return GetTarget('Persona', personaTemplate);

    case 'event':
      return GetTarget('Event', eventTemplate);

    case 'location':
      return GetTarget('Location', locationTemplate);
  }
}

const targetTemplate = {
  model: {
    id: 'id',
    name: '',
  }
};

const targetsTemplate = {
  counts: {
    totalContents: 20,
    contents: 20,
    contents_name: '2,8',
  },
  model: {
    totalContents: 100,
    cursor: 0,
    contents: [
      targetTemplate.model
    ],
  }
};

function GetTargets(size, taxLabel, searchLabel) {
  let template = targetsTemplate;

  if (size || taxLabel || searchLabel) {
    template = JSON.parse(JSON.stringify(template));
    size && (template.counts.targets = size);
    searchLabel && (template.model.contents[0].name = "~" + searchLabel);
    (searchLabel && searchLabel.toLocaleLowerCase() === "zero") && (template.counts.targets = 0)
  }
  return gimmeRandomData(template);
}


const targetForMakeupTemplate = {
  model: {
    id: 'id',
    name: '',
    type: '["event", "persona", "location"]',
    associatedDigitalAssets: [null]
  }
};

const targestForMakeupTemplate = {
  counts: {
    totalContents: 20,
    contents: 20,
    contents_name: '2',
    contents_type: 1,
  },
  model: {
    totalContents: 100,
    cursor: 0,
    contents: [
      targetForMakeupTemplate.model
    ],
  }
};

function GetTargetsForMakeup(size, filters, searchLabel) {
  let template = targestForMakeupTemplate;

  if(size || filters || searchLabel){
    template = JSON.parse(JSON.stringify(template));
    size && (template.counts.targets = size);
    searchLabel && (template.model.contents[0].name = "~" + searchLabel);
    filters && filters.length > 0 &&  (template.model.contents[0].type = JSON.stringify(filters));
    (searchLabel && searchLabel.toLocaleLowerCase() === "zero") && (template.counts.targets = 0)
  }
  return gimmeRandomData(template);
}

// console.log(gimmeRandomData());


module.exports = {
  GetProducts,
  GetProductById,
  GetUser,
  CreateTarget,
  GetTargets,
  GetTargetsForMakeup,
};
