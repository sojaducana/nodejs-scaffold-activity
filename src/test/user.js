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
});
