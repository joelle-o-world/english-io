const PredicateSet = require('./PredicateSet')

const Declarer = require('./Declarer')
const spawn = require('./spawn2')
const spawnSingle = require('./spawn')
const Entity = require('./Entity')
const Noun = require('./Noun')
const Sentence = require('./Sentence')

/**
 * @class Dictionary
 */

class Dictionary {
  constructor({adjectives, nouns, predicates} = {}) {
    this.adjectives = {} // {String:Function, String:Function, ...}
    this.nouns = {} //{String:Function, String:Function, ...}
    this.phrasalNouns = [] // [String, String, ...]
    this.predicates = new PredicateSet

    if(adjectives)
      this.addAdjectives(adjectives)
    if(nouns)
      this.addNouns(...nouns)
    if(predicates)
      this.addPredicates(...predicates)
  }

  addAdjective(adj, extendFunction) {
    this.adjectives[adj] = extendFunction
    return this
  }

  addAdjectives(adjectives) {
    for(let adj in adjectives)
      this.addAdjective(adj, adjectives[adj])
  }

  addNoun(noun) {
    noun = new Noun(noun)
    this.nouns[noun.noun] = noun
    if(noun.isPhrasal)
      this.phrasalNouns.push(noun)
    return this
  }

  addNouns(...nouns) {
    for(let noun of nouns)
      this.addNoun(noun)
    return this
  }

  addPredicates(...predicates) {
    this.predicates.addPredicates(...predicates)
    return this
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

  spawnSingle(str) {
    return spawnSingle(this, str)
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
