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
    console.log(this.params.id);

    let user = yield UserModel.findById(this.params.id);
    if (user) {
      console.log(user._id);
      this.body = {
        data: user
      };
      this.status = 200;
    } else {
      this.status = 404;
    }
  },
  find: function* () {
    let users = yield UserModel.find();
    this.body = {
      data: users
    };
    this.status = 200;
  },
  remove: function* () {
    console.log(this.params.id);

    yield UserModel.removeById(this.params.id);

    this.status = 204;
  }
};
