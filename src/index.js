/* globals Policies */
import 'babel-polyfill';
import debug from 'debug';
import koa from 'koa';
import * as Util from './utilities';
import json from 'koa-json';
import compose from 'koa-compose';
import bodyParser from 'koa-bodyparser';
import bootloaders from './bootloaders';
import routes from './routes';
import _ from 'lodash';
import co from 'co';
import render from 'koa-ejs';
import path from 'path';

let logger = debug('boot');
let router = require('koa-router')();

logger('Loading utilities.');
global.Util = Util;

_.merge(global, require('./error'));

let app = koa();

render(app, {
  root: path.join(__dirname, '../views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true
});

global.app = {};

global.app.started = co(function* () {
  app.use(json({pretty: false, param: 'pretty'}));
  app.use(bodyParser());

  for (let bootloader of bootloaders) {
    yield bootloader;
  }

  logger('Loading models.');
  Util.dynamicRequire('./models');

  logger('Loading controllers.');
  Util.dynamicRequire('./controllers');

  logger('Loading middlewares.');
  let middlewares = require('./middlewares').default;
  _.each(middlewares, middleware => {
    app.use(middleware);
  });

  logger('Loading policies.');
  Util.dynamicRequire('./policies', 'Policies');
  let policies = require('./policies').default;

  logger('Attaching routes.');
  _.each(routes, (value, key) => {
    logger('route', key);
    let stack = [];
    let handler = _.get(global, value);
    if (!handler) throw new Error(`${value} does not exist.`);
    let policyList = _.get(policies, value);
    if (policyList) {
      _.each(policyList, policy => {
        if (Policies[policy]) {
          stack.push(Policies[policy]);
        }
      });
    }
    let match = key.match(/^(GET|POST|DELETE|PUT|PATCH) (.+)$/);
    let method = match[1].toLowerCase();
    let path = match[2];
    stack.push(function* (next) {
      yield handler.call(this);
      yield next;
    });
    router[method](path, compose(stack));
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());

  yield new Promise(function(resolve) {
    global.app.server = app.listen(process.env.HTTP_PORT || 8080, resolve);
  });
  logger(`Server bound to port ${process.env.HTTP_PORT}.`);
});

global.app.started.catch(function(err) {
  console.error(err, err.stack);
});
