// Entity is the base class of all entities in EntityGame.
const regOps = require('./util/regOps.js')
const RandExp = require('randexp')
const spellcheck = require('./util/spellcheck')
//const {beA, be} = require('./predicates')
const Sentence = require('./Sentence')

const entityStr = require('./entityStr')
const {toRegexs} = require('./util/specarr')

//const consistsOfTree = require('./nouns/consistsOfTree')

const EventEmitter = require('events')

// MORE REQUIRES AT BOTTOM

/**
 * Entity represents an object in the world. It is half derived from the word
 * 'noun', half from the word 'entityenon'. Though it fits the definition of
 * neither precisely.
 * @class Entity
 * @extends EventEmitter
 * @constructor
 */

 /**
  * @event fact
  * @param {Sentence} sentence The new fact.
  */

/**
 * Emitted whenever the object changes location.
 * @event move
 * @param {Entity} oldLocation
 * @param {Entity} newLocation
 * @param {String} oldLocationType
 * @param {String} newLocationType
 */
/**
 * Emitter whenever a parent location of the object changes location
 * @event parentMove
 */
/**
 * @event childEnter
 */
/**
 * @event childExit
 */

/**
 * @event exited
 * @param {Entity} location
 * @param {String} locationType
 */

/**
 * @event entered
 * @param {Entity} location
 * @param {String} locationType
 */



class Entity extends EventEmitter {
  constructor(dictionary=null) {
    super()

    /**
     * @property {Dictionary} dictionary
     */
    this.dictionary = dictionary

    /**
     * A list of noun-strings which describe the entity.
     * @property {Array} nouns
     */
    this.nouns = []

    /**
     * A list of adjective strings which describe the entity.
     * @property {Array} adjectives
     */
    this.adjectives = []

    /**
     * A special array (see src/util/specarr.js) detailing proper nouns that
     * can be used to describe the Entity.
     * @property {SpecialArray} properNouns
     */
    this.properNouns = [entity => entity.name]

    /**
     * A list of sentences which are true in the present tense and have the entity
     * as one of their arguments.
     * @property {Array} facts
     */
    this.facts = []

    /**
     * A list of sentences which are true in the past tense and have the entity as
     * one of their arguments.
     * @property {Array} history
     */
    this.history = []

    /**
     * An object describing the preposition clauses which the entity can be
     * described with. The values of the object are SpecialArrays, indexed by
     * the preposition.
     * @property {Object} prepositionClauses
     */
    this.prepositionClauses = {}
    // ^(each key is a preposition, each value a specarr)

    // SOUND:
    /**
     * A list of Sound objects which have the entity as an origin
     * @property {Array} nowPlayingSounds
     */
    this.nowPlayingSounds = []
    /**
     * @property {SoundPlayer} soundPlayer
     */
    this.soundPlayer = null
  }

  /**
   * Attach an adjective to the entity.
   * @method be
   * @param {String} adjective The adjective to attach
   * @param {Dictionary} [dictionary = this.dictionary]
   * @chainable
   * @throws {String} In the case that the adjective is not in the dictionary.
   */
  be(adjective, dictionary=this.dictionary) {
    if(!dictionary)
      throw 'Entity .be() needs a Dictionary'
    // load an adjective extension
    if(this.is(adjective))
      return this

    if(dictionary.adjectives[adjective]) {

      dictionary.adjectives[adjective](this)
      if(!this.adjectives.includes(adjective))
        this.adjectives.push(adjective)

      return this
    } else
      throw 'no such adjective: ' + adjective
  }

  /**
   * Check whether a given adjective is attached to the entity
   * @method is
   * @param {String} adjective
   * @return {Boolean}
   */
  is(adjective) {
    return this.adjectives.includes(adjective)
  }

  /**
   * Remove a given adjective from the entity.
   * @method stopBeing
   * @param {String} adj
   */
  stopBeing(adj) {
    this.adjectives = this.adjectives.filter(a => a != adj)
    let sentence = Sentence.S(be, this, adj)
    for(let fact of this.facts) {
      if(Sentence.compare(sentence, fact))
        fact.stop()
    }
  }

  /**
   * Inherit properties from a given noun. This enables a non-hierachical
   * inheritance structure for entities. The dictionary of nouns is defined in
   * `src/nouns/index.js`.
   * @method be_a
   * @param {String} classname The noun to inherit properties from
   * @param {Dictionary} [dictionary = this.dictionary]
   * @chainable
   * @throws {String} In the case that the noun-string is not in the dictionary.
   */
  be_a(classname, dictionary=this.dictionary) {
    // load a noun extension
    if(!dictionary)
      throw '.be_a() needs a Dictionary'

    // don't load the same extension twice
    if(this.is_a(classname))
      return this

    if(dictionary.nouns[classname]) {
      // strings can be used as aliases to other classes
      while(dictionary.nouns[classname].constructor == String)
        classname = dictionary.nouns[classname]

      dictionary.nouns[classname](this)

      if(!this.nouns.includes(classname))
        this.nouns.push(classname)

      // consistsOfTree
      /*let parts = consistsOfTree[classname]
      if(parts) {
        // spawn parts
        parts = spawn(dictionary, ...parts)
        for(let part of parts)
          part.setLocation(this, 'consist')
      }*/

      // start `beA` sentence
      //new Sentence(beA, [this, classname]).start()

      /**
       * Emitted whenever the entity becomes a new noun.
       * @event becomeNoun
       * @param {String} classname
       */
      this.emit('becomeNoun', classname)

      return this
    } else
      throw 'no such entityclass: ' + classname
  }

  /**
   * Check whether the entity inherits from a given noun.
   * @method is_a
   * @param {String} classname The noun to check.
   * @return {Boolean}
   */
  is_a(classname) {
    return this.nouns.includes(classname)
  }

  /**
   * Compiles a regex for all possible noun-phrase strings for the entity.
   * @method reg
   * @param {Number} [depth=1]
   *  Limits the recursive depth for preposition phrases / embedded noun-phrases
   * @return {RegExp}
   */
  reg(depth=1) {
    // compile a regex for all possible nounphrase strings for this entity
    // depth limits the recursion depth for preposition-phrases/embedded noun-phrases

    let adjRegex = this.adjRegex()
    if(adjRegex)
      adjRegex = regOps.kleeneJoin(adjRegex, ',? ')

    depth--;
    let nounPhraseRegex = regOps.concatSpaced(
      regOps.optionalConcatSpaced(
        /a|an|the/,
        adjRegex,
      ),
      regOps.or(...this.nouns)
    )

    if(depth > 0) {
      let clauseRegex = this.clauseRegex(depth)
      if(clauseRegex)
        nounPhraseRegex = regOps.optionalConcatSpaced(
          nounPhraseRegex, clauseRegex//regOps.kleenePoliteList(clauseRegex)
        )
    }

    return regOps.or(
      nounPhraseRegex,
      ...toRegexs(this, this.properNouns, depth),
    )
  }

  /**
   * @method clauseRegex
   * @param {Number} depth Limits the recursive depth for embedded noun-phrases
   * @return {RegExp}
   *  A regular expression for any preposition phrase that can be included in
   *  a noun phrase for the entity. Or `null` if there are no prepositions
   *  clauses.
   */
  clauseRegex(depth) {
    let all = []
    for(let prep in this.prepositionClauses) {
      let clauses = this.prepositionClauses[prep]
      let regexs = toRegexs(this, clauses, depth)
      if(regexs.length)
        all.push(regOps.concatSpaced(prep, regOps.or(...regexs)))
    }

    if(all.length)
      return regOps.or(...all)
    else
      return null
  }

  /**
   * Compile a regular expression for any adjective that can be used to
   * describe this entity.
   * @method adjRegex
   * @return {RegExp or Null}
   */
  adjRegex() {
    let regexs = toRegexs(this, this.adjectives)
    if(regexs.length)
      return regOps.or(...regexs)
    else
      return null
  }

  /**
   * Test whether this entity matches a given noun-phrase string.
   * @method matches
   * @param {String} str
   * @return {Boolean}
   */
  matches(str) {
    // test this entity's regex against a string
    return regOps.whole(this.reg(2)).test(str)
  }

  /**
   * Randomly generate a noun-phrase that describes this entity
   * @method ref
   * @deprecated use .str() instead
   * @param ctx {DescriptionContext}
   * @param {Object} options
   * @return {String}
   */
  ref(ctx, options) {
    // come up with a random noun phrase to represent this entity
    return entityStr(this, ctx, options)
  }

  /**
   * Randomly generate a noun-phrase that describes this entity
   * @method str
   * @param ctx {DescriptionContext}
   * @param {Object} options
   * @return {String}
   */
  str(ctx, options) {
    return entityStr(this, ctx, options)
  }

  /**
   * Attaches a preposition clause to the entity
   * @method addClause
   * @param {String} prep The preposition
   * @param clause The clause following the preposition.
   */
  addClause(prep, clause) {
    // add a preposition clause to this Entity
    // the clause may be any unexpanded cell of a specarr
    if(!this.prepositionClauses[prep])
      this.prepositionClauses[prep] = [clause]
    else
      this.prepositionClauses[prep].push(clause)
  }

  /**
   * Remove a given preposition clause from the entity
   * @method removeClause
   * @param {String} prep The preposition
   * @param {String, Substitution, Function or Entity} clause
      The clause following the preposition
   */
  removeClause(prep, clause) {
    // remove a given preposition clause from this Entity
    let list = this.prepositionClauses[prep]
    if(list)
      this.prepositionClauses[prep] = list.filter(cl => cl != clause)
  }

  /**
   * Choose a random sentence which is presently true has this entity as an
   * argument.
   * @method randomFact
   * @return {Sentence}
   */
  randomFact() {
    return this.facts[Math.floor(Math.random() * this.facts.length)]
  }

  /**
   * Choose a random sentence which is true in the past-tense and has this entity
   * as an argument.
   * @method randomHistoricFact
   * @return {Sentence}
   */
  randomHistoricFact() {
    return this.history[Math.floor(Math.random() * this.history.length)]
  }

  /**
   * Choose a random sentence, true in the past or present tense, and has this
   * entity as an argument.
   * @method randomSentence
   * @return {Sentence}
   */
  randomSentence() {
    if(Math.random() * (this.facts.length + this.history.length) < this.facts.length)
      return this.randomFact()
    else
      return this.randomHistoricFact()
  }
}
Entity.prototype.isEntity = true
module.exports = Entity


const spawn = require('./spawn2')
