const {toPlural} = require('./util/plural')

/**
 * @class Noun
 * @constructor
 * @param {Object|String} options
 * @param {String} options.noun
 * @param {String|Array} options.inherits String or array of strings.
 * @param {Function} options.extendFunction
 * @param {Array} options.constructors
 */

class Noun {
  constructor(options) {
    // handle strings
    if(options.constructor == String)
      options = {noun:options}

    let {noun, inherits=[], extend, alias, spawners=[]} = options

    this.noun = noun
    this.singular = this.noun
    this.plural = toPlural(this.noun)

    this.regexTerminating = new RegExp(this.singular+'$', 'i')
    this.pluralRegexTerminating = new RegExp(this.plural+'$', 'i')

    this.regex = new RegExp(
      '^(?<pre_noun>.+) (?:(?:(?<singular>'
      + this.singular
      + '))|(?:(?<plural>'
      + this.plural
      + ')))$',
      'i'
    )

    if(inherits.constructor == String)
      this.inherits = [inherits]
    else if(inherits.constructor == Array)
      this.inherits = inherits

    if(extend)
      this.extendFunction = extend

    this.alias = alias

    this.spawners = spawners.slice()

    this.isPhrasal = / /.test(this.noun)

    // EXTRAS
    this.consistsOf = options.consistsOf
    this.contains = options.contains
    this.reverb = options.reverb
  }

  extend(entity) {
    for(let base of this.inherits)
      entity.be_a(base)

    if(this.extendFunction)
      this.extendFunction(entity)
  }

  parse(str) {
    let info = this.regex.exec(str)
    if(info)
      return {
        noun: this,
        plural: !info.groups.singular,
        str: str,
        remainder: info.groups.pre_noun,
      }
    else
      return null
  }
}
module.exports = Noun
