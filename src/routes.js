export default {
  'GET /': 'PageController.index',
  'POST /users': 'UserController.create',
  'GET /users/:id': 'UserController.findOne',
  'GET /users': 'UserController.find',
  'DELETE /users/:id': 'UserController.remove'
};
