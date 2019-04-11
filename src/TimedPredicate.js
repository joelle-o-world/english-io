const Predicate = require('./Predicate')
const delay = require('./delay')

/**
 * @class TimedPredicate
 * @extends Predicate
 * @constructor
 * @param {Object} options
 * @param {Number} options.duration
 */

class TimedPredicate extends Predicate {
  constructor(options) {
    options.until = callback => delay(options.duration, callback)
    super(options)
  }
}
module.exports = TimedPredicate
