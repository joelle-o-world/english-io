const Predicate = require('./Predicate')

/**
 * A class for handling multiple predicates at once.
 * @class PredicateSet
 * @constructor
 * @param {Predicate} [...predicates] Predicates to include in the set.
 */

class PredicateSet {
  constructor(...predicates) {
    /**
     * An array of predicates which are members of the set.
     * @property predicates {Array}
     */
    this.predicates = []

    this.syntaxs = []
    /**
     * The predicates of the set indexed by camel case name.
     * @property byName {Object}
     */
    this.byName = {}

    /**
     * A list of predicates that do not have any literal parameters.
     * @property nonLiteral
     */
    this.nonLiteral = []

    this.addPredicates(...predicates)
  }

  /**
   * Adds predicates to the set.
   * @method addPredicates
   * @param {Predicate} ...predicates The predicates to be added.
   */
  addPredicates(...predicates) {
    for(let p of predicates) {
      if(p.constructor == Object)
        p = new Predicate(p)

      if(p.isPredicate) {
        this.predicates.push(p)
        for(let syntax of p.forms)
          this.syntaxs.push(syntax)
        for(let name of p.names)
          this.byName[name] = p

        if(!p.hasLiterals)
          this.nonLiteral.push(p)
      }
    }
    this.sortPredicates()
  }

  /**
   * Parse a sentence string against all the predicates in the set.
   * @method parse
   * @param {String} str The sentence string to parse
   * @param {Array} tenses
   *  An array of strings. The tenses to parse the stirng against.
   * @return {Array}
   *  An array of matches to the string as sentenses with
   *  placeholder-string arguments.
   */
  parse(str, tenses) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parse(str, tenses)
      if(interpretation)
        interpretations.push(interpretation)
    }

    return interpretations
  }

  /**
   * Parse a string in the imperative tense for a given subject. The subject
   * will be copied to the subject argument of the resultant sentences
   * @method parseImperative
   * @param {String} str
   * @param {Entity} subject The subject, either a entity or a string.
   * @return {Array} An array sentence with placeholder-string arguments.
   */
  parseImperative(str, subject) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parseImperative(str, subject)
      if(interpretation)
        interpretations.push(interpretation)
    }

    return interpretations
  }

  /**
   * Parse a sentence-string in noun-phrase form. Eg/ "the cup that is on the
   * table".
   * @method parseNounPhrase
   * @param {String} str
   * @return {Array} An array of sentences with string-placeholder arguments
   */
  parseNounPhrase(str) {
    let interpretations = []
    for(let p of this.predicates) {
      let interpretation = p.parseNounPhrase(str)
      if(interpretation)
      interpretations.push(interpretation)
    }

    return interpretations
  }

  /**
   * @method random
   * @return {Predicate} A random predicate from the set.
   */
  random() {
    return this.predicates[Math.floor(Math.random()*this.predicates.length)]
  }

  /**
   * Sorts predicates in descending order of 'specificness'.
   * @method sortPredicates
   */
  sortPredicates() {
    this.predicates = this.predicates.sort(
      (A, B) => B.specificness-A.specificness
    )
    this.syntaxs = this.syntaxs.sort(
      (p, q) => q.specificness-q.specificness
    )
  }
}
module.exports = PredicateSet
