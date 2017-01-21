/* globals app, UserModel */

import {expect} from 'chai';

let request;
describe('User', function() {
  before(function* () {
    yield app.started;
    request = require('supertest')(app.server);
  });

  describe('POST /users', function() {
    describe('Given valid parameters', function() {
      it('should create new user', function* () {
        let params = {
          username: 'zenoan',
          email: 'roger.madjos@gmail.com'
        };

        let result = yield request
          .post('/users')
          .send(params)
          .expect(201)
          .expect(res => {
            expect(res.body.data).to.has.property('_id');
          });

        let user = yield UserModel.findById(result.body.data._id);
        expect(user).to.has.property('username', params.username);
        expect(user).to.has.property('email', params.email);
      });
    });

    describe('Given invalid parameters', function() {
      it('should return status 400', function* () {
        let params = {
          username: 'protozenoan',
          email: 'not an email'
        };

        yield request
          .post('/users')
          .send(params)
          .expect(400)
          .expect(res => {
            expect(res.body).to.has.property('code', 'INVALID_REQUEST');
          });
      });
      it('should return status 400', function* () {
        let params = {
          email: 'roger@highoutput.io'
        };

        yield request
          .post('/users')
          .send(params)
          .expect(400)
          .expect(res => {
            expect(res.body).to.has.property('code', 'INVALID_REQUEST');
          });
      });
    });
  });

  describe('GET /user/:id', function() {
    let params = {
          username: 'zenoan',
          email: 'roger.madjos@gmail.com'
        };

    let userId;
    before(function* () {
      let user = new UserModel(params);
      yield user.save();
      userId = user._id;
    });

    describe('Given user is found', function() {
      it('Should return status 200', function* () {
        yield request
          .get('/users/'+userId)
          .expect(200)
          .expect(res => {
            expect(res.body.data).to.has.property('_id', userId);
          });
      });
    });

    describe('Given user is not found', function() {
      it('Should return status 404', function* () {
        yield request
          .get('/users/unknown')
          .expect(404);
      });
    });
  });

  describe('GET /users', function() {
    describe('Given valid request', function() {
      it('Should return status 200', function* () {
        yield request
          .get('/users')
          .expect(200);
      });
    });

    // let params = {
    //       username: 'zenoan',
    //       email: 'roger.madjos@gmail.com'
    //     };

    // let userId;
    // let users = {};
    // before(function* () {
    //   let createResult = yield request
    //     .post('/users')
    //     .send(params);
    //   userId = createResult.body.data._id;

    //   let user = yield request
    //       .get('/users/'+userId);

    //   users[user._id] = user;

    //   console.log(users);
    // });

    // describe('Given there is one user created', function() {
    //   it('Should return size of 1', function* () {
    //     yield request
    //       .get('/users')
    //       .expect(200)
    //       .expect(res => {
    //         expect(users.length).to.equal(res.body.data.length);
    //       });
    //   });
    // });
  });

  describe('DELETE /users/id', function() {
    let params = {
          username: 'zenoan',
          email: 'roger.madjos@gmail.com'
        };

    let userId;
    before(function* () {
      let user = new UserModel(params);
      yield user.save();
      userId = user._id;
    });

    describe('Given user was deleted', function() {
      it('Should return 204', function* () {
        yield request
          .delete('/users/'+userId)
          .expect(204);

          let user = yield UserModel.findById(userId);
          expect(user).to.be.undefined;
      });
    });
  });
});
