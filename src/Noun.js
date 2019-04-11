/**
 * @class Noun
 * @constructor
 * @param {Object|String} options
 * @param {String} options.noun
 * @param {String|Array} options.inherits String or array of strings.
 * @param {Function} options.extendFunction
 */

class Noun {
  constructor(options) {
    if(options.constructor == String)
      options = {noun:options}

    let {noun, inherits=[], extend, alias} = options

    this.noun = noun

    if(inherits.constructor == String)
      this.inherits = [inherits]
    else if(inherits.constructor == Array)
      this.inherits = inherits

    if(extend)
      this.extendFunction = extend

    this.alias = alias


    this.isPhrasal = / /.test(this.noun)
  }

  extend(entity) {
    for(let base of this.inherits)
      entity.be_a(base)

    if(this.extendFunction)
      this.extendFunction(entity)
  }
}
module.exports = Noun
