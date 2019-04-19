const Substitution = require('./util/Substitution')
const getNounPhraselet = require('./util/getNounPhraselet')
const regops = require('./util/regops')
const search = require('./search')
const parseList = require('./util/politeList').parse

const placeholderRegex = /(?:@|#|L)?_/g
/*
  /(?:@|#|L)_/
  @: literal
  #: number
  L: list
*/

/**
 * @class EntitySpawner
 * @constructor
 * @param options
 * @param {String} options.template
 *  The template string describing the syntax of the entity spawner.
 * @param {Function} construct
 *  A function which takes a list of arguments (parsed from a string) and
 *  returns an entity.
 * @param {} format
 *  The inverse of construct, takes an entity and returns an array of arguments.
 */
class EntitySpawner {
  constructor({template, construct, format, phraseletMode=true}) {
    this.phraseletMode = phraseletMode

    this.template = template
    this.unboundRegex = new RegExp(
      this.template.replace(placeholderRegex, '(.+)')
    )
    this.regex = regops.whole(this.unboundRegex)

    let placeholders = this.template.match(placeholderRegex)
    if(placeholders)
      this.params = placeholders.map(ph => ({
        entity: ph[0] == '_',
        number: ph[0] == '#',
        literal: ph[0] == '@',
        list: ph[0] == 'L',
      }))
    else
      this.params = []

    this._construct = construct
  }

  parse(str, domain) {
    if(this.phraseletMode)
      str = getNounPhraselet(str).phraselet

    let result = this.regex.exec(str)
    if(result) {
      let args = result.slice(1)
      for(let i in args) {
        if(this.params[i].literal)
          continue
        if(this.params[i].number) {
          args[i] = parseFloat(args[i])
          if(isNaN(args[i]))
            return null
        }
      }

      // parse entities last to reduce the risk of dropping a spawned entity
      for(let i in args)
        if(this.params[i].entity) {
          args[i] = this.dictionary.findOrSpawn(args[i], domain)
          if(!args[i])
            return null
        } else if(this.params[i].list) {
          let list = parseList(args[i])
          if(list)
            for(let j in list) {
              list[j] = this.dictionary.findOrSpawn(list[j], domain)
              if(!list[j])
                return null
            }
          args[i] = list
        }
      // BUG STILL EXISTS WAITIMG!! Need to delay spawner construction


      return {
        entitySpawner: this,
        args: args,
      }
    } else
      return null
  }

  compose(...args) {
    return new Substitution(this.template, ...args)
  }

  str(args) {
    return this.compose(...args).str()
  }

  construct(...args) {
    if(this._construct)
      return this._construct(...args)
    else
      throw "EntitySpawner's ._construct() is not defined: " + this.template
  }
}
EntitySpawner.prototype.isEntitySpawner = true
module.exports = EntitySpawner
