const MockDataForUserList = [
  {
    id: '1',
    username: 'ben.vessey',
    firstName: 'Ben',
    lastName: 'Vessey',
    access: {},
    realmRoles: [],
    clientRoles: {},
    createdTimestamp: 1234,
    email: 'benv@mizuno.com',
    emailVerified: true,
    enabled: true,
  },
  {
    id: '2',
    username: 'bas.korsten',
    firstName: 'Bas',
    lastName: 'Korsten',
    access: {},
    realmRoles: [],
    clientRoles: {},
    createdTimestamp: 1235,
    email: 'bask@mizuno.com',
    emailVerified: true,
    enabled: true,
  },
  {
    id: '3',
    username: 'dave.t',
    firstName: 'Dave',
    lastName: 'Turfitt',
    access: {},
    realmRoles: [],
    clientRoles: {},
    createdTimestamp: 1236,
    email: 'davet@mizuno.com',
    emailVerified: false,
    enabled: false,
  },
  {
    id: '4',
    username: 'Rob.L',
    firstName: 'Rob',
    lastName: 'Leek',
    access: {},
    realmRoles: [],
    clientRoles: {},
    createdTimestamp: 1236,
    email: 'robl@mizuno.com',
    emailVerified: false,
    enabled: true,
  },
];

const MockDataForRolesAssignedToUser = [
  {
    id: 'ce6f66a8-7bd0-431b-b33e-6d3d9d103435',
    name: 'Graphic Designer',
    composite: false,
    clientRole: false,
    containerId: '9596ecdf-6d1f-4b34-b745-f481f1c1491e',
  },
  {
    id: 'ce6f66a8-7bd0-431b-b33e-6d3d9d103435',
    name: 'Admin',
    composite: false,
    clientRole: false,
    containerId: '9596ecdf-6d1f-4b34-b745-f481f1c1491e',
  },
  {
    id: 'ce6f66a8-7bd0-431b-b33e-6d3d9d103435',
    name: 'Channel Manager',
    composite: false,
    clientRole: false,
    containerId: '9596ecdf-6d1f-4b34-b745-f481f1c1491e',
  },
];

module.exports = { MockDataForUserList, MockDataForRolesAssignedToUser };
