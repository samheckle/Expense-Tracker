// import the controller folder (automatically calls the index.js file)
const controllers = require('./controllers');

const router = (app) => {
  app.get('/example1', controllers.example1);
  app.get('/', controllers.example1);
  app.post('/addColumn', controllers.handleCategoryPost);
  app.post('/addExpense', controllers.handleCategoryPost);
};

module.exports = router;
