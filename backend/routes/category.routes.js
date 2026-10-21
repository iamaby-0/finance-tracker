const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
  app.get(
    '/aft/api/v1/categories',
    authMiddleware.isAuthenticated,
    categoryController.getCategories
  );

  app.post(
    '/aft/api/v1/categories',
    authMiddleware.isAuthenticated,
    categoryController.createCategory
  );

  app.delete(
    '/aft/api/v1/categories/:id',
    authMiddleware.isAuthenticated,
    categoryController.deleteCategory
  );
};

module.exports = routes;
