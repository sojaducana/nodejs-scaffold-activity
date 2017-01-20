import path from 'path';
import _ from 'lodash';

/**
 * Require all files inside a directory
 * @param {string} dir
 * @param {string} namespace
 */
export function dynamicRequire(dir, namespace) {
  let normalizedPath = path.join(__dirname, dir);
  try {
    let files = require('fs').readdirSync(normalizedPath);
    _.each(files, file => {
      let mod = require(path.resolve(__dirname, dir, file));
      if (namespace) {
        global[namespace] = _.merge(global[namespace] || {}, mod);
      } else {
        _.merge(global, mod);
      }
    });
  } catch (err) {}
}
