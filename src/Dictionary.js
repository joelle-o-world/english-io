const PredicateSet = require('./PredicateSet')

const Declarer = require('./Declarer')
const spawn = require('./spawn2')
const spawnSingle = require('./spawn')

class Dictionary {
  constructor() {
    this.adjectives = {} // {String:Function, String:Function, ...}
    this.nouns = {} //{String:Function, String:Function, ...}
    this.phrasalNouns = [] // [String, String, ...]
    this.predicates = new PredicateSet
  }

  addAdjective(adj, extendFunction) {
    this.adjectives[adj] = extendFunction
    return this
  }

  addAdjectives(adjectives) {
    for(let adj in adjectives)
      this.addAdjective(adj, adjectives[adj])
  }

  addNoun(noun, extendFunction) {
    this.nouns[noun] = extendFunction
    if(/ /.test(noun))
      this.phrasalNouns.push(noun)
    return this
  }

  addNouns(nouns) {
    for(let noun in nouns)
      this.addNoun(noun, nouns[noun])

    return this
  }

  addPredicates(...predicates) {
    this.predicates.addPredicates(...predicates)
  }

  quickDeclare(...strings) {
    let dec = new Declarer(this)

    dec.declare(...strings)

    return dec.entitys
  }

  spawn(...strings) {
    return spawn(this, strings)
  }

  spawnSingle(str) {
    return spawnSingle(this, str)
  }
}
module.exports = Dictionary
