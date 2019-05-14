const PredicateSet = require('./PredicateSet')

const DescriptionContext = require('./DescriptionContext')
const declare = require('./declare')

const Declarer = require('./Declarer')
const spawn = require('./spawn2')
const spawnSingle = require('./spawn')
const Entity = require('./Entity')
const Noun = require('./Noun')
const Sentence = require('./Sentence')
const EntitySpawner = require('./EntitySpawner')
const search = require('./search')
const SentenceModifierSet = require('./SentenceModifierSet')

/**
 * @class Dictionary
 */

class Dictionary {
  constructor({adjectives, nouns, predicates, modifiers} = {}) {
    this.adjectives = {} // {String:Function, String:Function, ...}
    this.nouns = {} //{String:Function, String:Function, ...}
    this.phrasalNouns = [] // [String, String, ...]
    this.predicates = new PredicateSet
    this.actionPredicates = new PredicateSet
    this.entitySpawners = []
    this.modifiers = new SentenceModifierSet

    if(adjectives)
      this.addAdjectives(adjectives)
    if(nouns)
      this.addNouns(...nouns)
    if(predicates)
      this.addPredicates(...predicates)
    if(modifiers)
      this.addModifiers(...modifiers)

    this.checkOwnership // (owner, possession) => {...}
    this.declareOwnership // (owner, possession) => {...}
    this.getOwners // possesion => [...owners]
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
    this.actionPredicates.addPredicates(
      ...predicates.filter(P => P.actionable)
    )
    for(let p of predicates)
      p.dictionary = this
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

  addModifiers(...modifiers) {
    for(let modifier of modifiers) {
      this.modifiers.addModifier(modifier)
      modifier.dictionary = this
    }
  }

  declare(ctx, ...strings) {
    if(ctx.constructor == String) {
      strings.unshift(ctx)
      ctx = new DescriptionContext
    }

    return declare(this, ctx, ...strings)
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

  interpretSloppyList(stuff) {
    let list = []
    for(let bit of stuff) {
      if(bit.isEntity)
        list.push(bit)
      else if(bit.constructor == String) {
        let spawned = this.spawn(bit)
        if(spawned.length)
          list.push(...spawned)
        else {
          spawned = this.spawnSingle(bit)
          if(spawned)
            this.push(spawned)
        }
      }
    }
    return list
  }

  get nonLiteralPredicates() {
    return this.predicates.nonLiteral
  }
}
module.exports = Dictionary
