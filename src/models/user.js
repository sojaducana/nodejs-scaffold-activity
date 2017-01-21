/* globals AppError */
import _ from 'lodash';
import {v1 as uuid} from 'uuid';
import Ajv from 'ajv';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

let users = {};

export class UserModel {
  /**
   * Constructor
   * @param {object} properties
   * @param {string} properties.username
   * @param {string} properties.email
   */
  constructor(properties) {
    this._id = uuid();
    _.merge(this, properties);

    this.validate = ajv.compile({
      properties: {
        username: {
          type: 'string',
          minLength: 6
        },
        email: {
          type: 'string',
          format: 'email'
        }
      },
      required: ['username', 'email']
    });
  }

  * save() {
    let valid = this.validate(this);
    if (!valid) {
      throw new AppError('INVALID_REQUEST', 'Invalid request', {
        errors: this.validate.errors
      });
    }
    this.createdAt = new Date();
    users[this._id] = this;
  }

  static* findById(id) {
    return users[id];
  }

  static* find() {
    return _(users)
      .map()
      .sortBy(user => {
        return 1 / user.createdAt.getTime();
      })
      .value();
  }

  static* removeById(id) {
    delete users[id];
  }
}
