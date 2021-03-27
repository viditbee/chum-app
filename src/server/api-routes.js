const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const jsonParser = bodyParser.json();

const HTTP_PROXY_CODE = 222;

const {
  GetProducts, GetUser,
} = require('./lib/mock-data-generator');

const withDelay = (func, delay = 2000) => {
  setTimeout(func, delay);
};

module.exports = (app) => {
  app.get('/user', (req, res) => {
    res.status(HTTP_PROXY_CODE);
    res.send(GetUser());
  });

  app.post('/data-discovery/bundles/search', jsonParser, (req, res) => {
    res.status(HTTP_PROXY_CODE);
    withDelay(() => { res.send(GetProducts(null, 'Bundle', req.body.searchText)); });
  });

  app.use(
    ['/service', '/secret'],
    createProxyMiddleware({
      target: 'http://localhost:80',
      changeOrigin: true,
      logLevel: 'debug',
    }),
  );

  /**
   * Examples to map server requests that needs to be mocked,
   *
   * To map a URL with params, URL should be provided as /base-products/:id/:name
   * These can be accessed as req.params.id and req.params.name
   *
   * Query parameters (with ? in the URL) can be accessed as req.query.id and req.query.id
   *
   * const MockDataForProducts = {
   *  productList: [{ id: 1234, label: 'Shirt' }, { id: 4567, label: 'Jeans' }],
   * };
   *
   * app.get('/client1/search/products', (req, res) => {
   *  res.send(MockDataForProducts);
   * });
   *
   * app.post('/client1/filter/products', (req, res) => {
   *  const { id } = req.body;
   *  const foundProduct = MockDataForProducts.productList.filter((product) => product.id === id);
   *  res.send(foundProduct);
   * });
   *
   * app.put('/client1/create/products', (req, res) => {
   *  const { id, label } = req.body;
   *  MockDataForProducts.productList.push({ id, label });
   *  res.sendStatus(200);
   * });
   *
   * app.delete('/client1/remove/products', (req, res) => {
   *  const { id } = req.body;
   *  const array = MockDataForProducts.productList;
   *  const index = array.findIndex((product) => product.id === id);
   *  let deletedItem = [];
   *  if (index > -1) {
   *    deletedItem = array.splice(index, 1);
   *  }
   *  res.send(deletedItem);
   * });
   */
};
