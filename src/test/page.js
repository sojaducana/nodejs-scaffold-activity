/* globals app */
import {expect} from 'chai';

let request;

describe('Page', function() {
  before(function* () {
    yield app.started;
    request = require('supertest')(app.server);
  });

  it('should return current version', function* () {
    yield request
      .get('/')
      .expect(res => {
        expect(res.text).to
          .equal(`version ${require('../../package.json').version}\n`);
      })
      .expect(200);
  });
});
