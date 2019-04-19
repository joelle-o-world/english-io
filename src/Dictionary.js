const PredicateSet = require('./PredicateSet')

const Declarer = require('./Declarer')
const spawn = require('./spawn2')
const spawnSingle = require('./spawn')
const Entity = require('./Entity')
const Noun = require('./Noun')
const Sentence = require('./Sentence')
const EntitySpawner = require('./EntitySpawner')
const search = require('./search')

/**
 * @class Dictionary
 */

class Dictionary {
  constructor({adjectives, nouns, predicates} = {}) {
    this.adjectives = {} // {String:Function, String:Function, ...}
    this.nouns = {} //{String:Function, String:Function, ...}
    this.phrasalNouns = [] // [String, String, ...]
    this.predicates = new PredicateSet
    this.entitySpawners = []

    if(adjectives)
      this.addAdjectives(adjectives)
    if(nouns)
      this.addNouns(...nouns)
    if(predicates)
      this.addPredicates(...predicates)
  }

  /* Add an adjective to the dictionary */
  addAdjective(adj, extendFunction) {
    this.adjectives[adj] = extendFunction
    return this
  }

  /* Add adjectives to the dictionary. */
  addAdjectives(adjectives) {
    for(let adj in adjectives)
      this.addAdjective(adj, adjectives[adj])
  }

  /* Add a noun to the dictionary. */
  addNoun(noun) {
    if(noun.dictionary)
      throw 'Dictionary conflict over noun: ' + noun.noun

    if(!noun.isNoun)
      noun = new Noun(noun)

    noun.dictionary = this

    this.nouns[noun.noun] = noun

    if(noun.isPhrasal)
      this.phrasalNouns.push(noun)

    if(noun.spawners)
      for(let spawner of noun.spawners)
        this.addEntitySpawner(spawner)

    return this
  }

  /* Add nouns to the dictionary */
  addNouns(...nouns) {
    for(let noun of nouns)
      this.addNoun(noun)
    return this
  }

  /* Add predicates to the dictionary */
  addPredicates(...predicates) {
    this.predicates.addPredicates(...predicates)
    return this
  }

  addEntitySpawner(spawner) {
    if(spawner.dictionary)
      throw 'Dictionary conflict over entity spawner: '+spawner.template
    if(!spawner.isEntitySpawner)
      spawner = new EntitySpawner(spawner)
    this.entitySpawners.push(spawner)
    spawner.dictionary = this

    return this // chainable
  }

  addEntitySpawners(...spawners) {
    for(let spawner of spawners)
      this.addEntitySpawner(spawner)
  }


  quickDeclare(...strings) {
    let dec = new Declarer(this)

    dec.declare(...strings)

    return dec.entities
  }

  createEntity() {
    return new Entity(this)
  }

  spawn(...strings) {
    return spawn(this, ...strings)
  }

  spawnSingle(str, domain) { // domain is an Entity or an iterable of Entities
    return spawnSingle(this, str, domain)
  }

  findOrSpawn(matchStr, domain) {
    let result = null
    if(domain)
      result = search.first(matchStr, domain)
    if(result)
      return result
    else
      return this.spawnSingle(matchStr, domain)
  }

  S(predicate, ...args) {
    if(predicate.constructor == String)
      predicate = this.predicates.byName[predicate]

    let sentence = new Sentence(predicate, args)
    sentence = sentence.trueInPresent() || sentence
    return sentence
  }
}
module.exports = Dictionary
