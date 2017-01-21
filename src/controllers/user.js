/* globals UserModel */

export let UserController = {
  create: function* () {
    let user = new UserModel(this.request.body);
    yield user.save();

    this.body = {
      data: {
        _id: user._id
      }
    };
    this.status = 201;
  },
  findOne: function* () {
  },
  find: function* () {
  },
  remove: function* () {
  }
};
