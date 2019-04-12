const EventEmitter = require('events')
const SentenceQueue = require('./SentenceQueue')
// ...more requires at bottom


/**
 * @class Sentence
 * @extends EventEmitter
 * @constructor
 * @param {Predicate} predicate
 * @param {Array} args
 */
class Sentence extends EventEmitter {
  constructor(predicate=null, args=null) {
    super()

    /** A Predicate object defining the relationship between the
     *  arguments
     * @property {Predicate} predicate
     */
    this.predicate = predicate

    /**
     * an array of Entity/String arguments
     * @property {Array} args
     */
    this.args = args // an array of Entity/String arguments

    /**
     * The truth value of the sentnece. May be `'true'`, `'planned'`,
     * `'false'`, `'past'`, `'hypothetical'` or `'superfluous'`
     * @property {String} truthValue
     * @default "hypothetical"
     */
    this.truthValue = 'hypothetical'

    /**
     * a list keeping track of all currently active clause objects
     * @property {Array} presentClauses
     */
    this.presentClauses = []
    /**
     * a list keeping track of all past tense clause objects
     * @property {Array} pastClauses
     */
    this.pastClauses = []
  }

  /**
   * Check to see if the arguments are compatible with the predicate in
   * terms of their type.
   * @method checkArgs
   * @return {Boolean}
   */
  checkArgs() {
    return this.predicate.checkArgs(this.args)
  }

  /**
   * If this sentence already exists in the arguments' fact lists return
   * the already existing version. Otherwise false.
   * @method trueInPresent
   * @return {Sentence or Boolean}
   */
  trueInPresent() {
    if(this.truthValue == 'true')
      return true

    if(this.truthValue == 'hypothetical') {
      for(let arg of this.entityArgs) {
        for(let fact of arg.facts)
          if(Sentence.compare(fact, this)) {
            this.truthValue = 'superfluous'
            return fact
          }
      }
      return false
    }


    // the present truth value predicates without entity arguments is undefined
    return undefined
  }

  /**
   * Check whether the sentence was true in the past.
   * @method trueInPast
   * @return {Boolean}
   */
  trueInPast() {
    if(this.truthValue == 'past')
      return true

    if(this.truthValue == 'hypothetical')
      for(let arg of this.args)
        if(arg.isEntity)
          return arg.history.some(fact => Sentence.compare(fact, this))
  }

  /**
   * Get a list of all arguments which are entities, including those from
   * embedded sub-sentences.
   * @attribute recursiveEntityArgs
   * @readOnly
   * @type {Array}
   */
  get recursiveEntityArgs() {
    let all = []
    for(let arg of this.args)
      if(arg.isNounPhraseSentence)
        all.push(...arg.recursiveEntityArgs)
      else if(arg.isEntity)
        all.push(arg)

    return all
  }

  /**
   * Attach facts and preposition clauses to the Entity arguments.
   * @method addFactsAndClauses
   * @return {null}
   */
  addFactsAndClauses() {
    if(!this.predicate.dontObserve)
      for(let i=0; i<this.args.length; i++) {
        let arg = this.args[i]
        if(arg.isEntity) {
          // emit on('fact') event
          arg.emit('fact', this)

          // add sentence to argument's fact set
          arg.facts.push(this)

          for(let clause of this.predicate.presentPrepositionClausesFor(i, this.args)) {
            arg.addClause(clause.preposition, clause.clause)

            // rmb the clause so it can be removed later (when `stop` is called)
            this.presentClauses.push(clause)
          }
        }
      }
  }

  /**
    * Starts a sentence.
    * @method start
    * @return Sentence or SentenceQueue (if postponed by prepare)
    */
  start() {
    // throw an error if this.checkArgs() fails
    if(!this.checkArgs())
      throw 'sentence has illegal args'

    // exit early if predicate's skipIf returns truthy value
    if(this.predicate.skipIf) {
      let skip = this.predicate.skipIf(...this.args, this)
      if(skip) {
        this.truthValue = 'skipped'

        return this
      }
    }

    // if prepare is defined in the predicate, queue the the preparation and
    // reschedule this.start()
    if(this.predicate._prepare && !this.preparationQueue) {
      let preparationSentences = this.predicate._prepare(...this.args, this)
      if(preparationSentences) {
        // create a new queue of the preparation sentences
        let queue = new SentenceQueue(...preparationSentences)
        this.preparationQueue = queue

        // reschedule this sentence start to after the queue
        queue.once('stop', () => this.start())

        // set truth value to planned
        this.truthValue = 'planned'

        // start the queue
        queue.start()

        // exit
        return this
      }
    }

    // skip declare if is already true according to this.predicate.check()
    if(!(this.predicate.check && this.predicate.check(...this.args, this))) {

      // exit early if there are problems according to this.predicate.problem()
      if(this.predicate.problem) {
        let problems = this.predicate.problem(...this.args, this)
        if(problems) {
          this.truthValue = 'failed'
          this.failureReason = problems

          /**
           * Emitted when there is a predicate defined problem starting
           * the sentence.
           * @event problem
           * @param failureReason
           */
          this.emit('problem', this.failureReason)
          return this
        }
      }

      // DECLARE: ie' make the sentence true by altering the entity structure
      // execute nested NounPhraseSentences in arguments
      let n = 0
      for(let i in this.args) {
        if(this.args[i].isNounPhraseSentence) {
          this.args[i].start() // .start() in new implementation
          this.args[i] = this.args[i].mainArgument
          n++
        }
      }
      // check arguments again
      if(n && !this.checkArgs())
        throw 'sentence has illegal args after executing nested sentences'

      // execute the predicate on the args
      if(this.predicate._begin)
        this.predicate._begin(...this.args, this)
    }

    // skip observe if is already true according to this.trueInPresent()
    let alreadyExistingVersion = this.trueInPresent()
    if(alreadyExistingVersion) {
      alreadyExistingVersion.once('stop', () => this.stop())
      return alreadyExistingVersion
    } else {
      // OBSERVE:

      // set truth value to true
      this.truthValue = 'true'

      // add facts and clauses
      this.addFactsAndClauses()

      if(this.predicate._expand) {
        let expansion = this.predicate._expand(...this.args, this)
        if(expansion) {
          let queue = new SentenceQueue(...expansion)
          queue.once('stop', () => this.stop())
          queue.start()
        }
      }

      // call the predicate's `until` function if it exists
      if(this.predicate.until)
        this.predicate.until(
          () => this.stop(),
          ...this.args, this,
        )

      /**
       * Emitted when a sentence successfully starts
       * @event start
       * @deprecated
       */
      this.emit('start')

      // return self
      return this
    }
  }

  /**
   * Stops the sentence.
   * @method stop
   */
  stop() {
    // make the sentence no longer true

    if(this.truthValue == 'superfluous') {
      this.emit('stop')
      return this
    }

    // exit early if sentence is not 'true'
    if(this.truthValue != 'true' /*&& this.truthValue != 'planned'*/) {
    console.warn(
      'rejected sentence stop because truth value = ' + this.truthValue,
      '('+this.str()+')'
    )
      return this
    }

    // set truth value to 'past'
    this.truthValue = 'past'

    // call _afterwards semantic function and handle consequences
    if(this.predicate._afterwards) {
      // call _afterwards. It may return any a Sentence or array of sentences as
      // consequences.
      let consequences = this.predicate._afterwards(...this.args, this)
      if(consequences) {
        // start a single-sentence consequence
        if(consequences.isSentence)
          consequences.start()
        // start list of consequence sentences
        else if(consequences.constructor == Array)
          for(let sentence of consequences)
            sentence.start()
      }
    }

    // remove preposition clauses
    for(let {mainArgument, preposition, clause} of this.presentClauses)
      mainArgument.removeClause(preposition, clause)

    // remove facts from arguments
    for(let arg of this.entityArgs) {
      //let arg = this.args[i]
      arg.emit('factOff', this)
      arg.facts.splice(arg.facts.indexOf(this), 1)
    }

    // call observe past
    this.observePast()

    /**
     * Emitted when the sentence has successfully stopped.
     * @event stop
     */

    // emit stop event
    this.emit('stop')
  }

  /**
   * Called when the sentence becomes past-tense
   * @method observePast
   */
  observePast() {
    // observe that this sentence is now in the past

    for(let i in this.args) {
      let arg = this.args[i]

      // add fact to arguments history
      if(arg.history
      && !arg.history.some(fact => Sentence.compare(fact, this))) {

        arg.history.push(this)

        for(let clause of this.predicate.pastPrepositionClausesFor(i, this.args)) {
          // attach clause to arg
          arg.addClause(clause.preposition, clause.clause)

          // remember the clause so it can be removed later
          this.pastClauses.push(clause)
        }
      }
    }
  }

  /**
   * Generate a string version of the sentence.
   * @method str
   * @param {String} [tense = "simple_present"]
   * @param {DescriptionContext} ctx
   * @param {Object} entityStrOptions
   * @return {String}
   */
  str(tense='simple_present', ctx, entityStrOptions) {
    return this.predicate.str(
      {args: this.args, tense:tense},
      ctx, entityStrOptions
    )
  }

  /**
   * Check equality of two sentences
   * @method compare
   * @static
   * @param {Sentence} P
   * @param {Sentence} Q
   * @return {Boolean}
   */
  static compare(P, Q) {
    // Compare two sentences, P and Q.
    // Return true if both the predicates and the arguments match.

    if(P == Q) // if P and Q are the same object, they are equal
      return true

    // P and Q are inequal if they have diferent prediactes
    if(P.predicate != Q.predicate) {
      return false
    }

    // P and Q are inequal if any of the arguments don't agree
    for(let i in P.args)
      if(P.args[i] != Q.args[i]) {
        return false
      }

    // if we reach this point without returning false, P and Q are equal!
    return true
  }

  /**
   * Quick constructor for sentence objects.
   * @method S
   * @static
   * @param {Predicate/String} predicate
   *  The predicate or a camel case name referencing a the predicate.
   * @param {Entity/String} ...args
   *  The arguments.
   * @return {Sentence}
   */
  static S(predicate, ...args) {
    if(!predicate.isPredicate) {
      throw "Sentence.S expects a predicate as first argument." +
            " Recieved: " + predicate
    }
    return new Sentence(predicate, args)
  }

  /**
   * @attribute entityArgs
   * @readOnly
   * @type {Array}
   */
  get entityArgs() {
    return this.args.filter(arg => arg.isEntity)
  }

  /**
   * @method randomEntityArg
   * @return {Entity}
   */
  randomEntityArg() {
    let entityArgs = this.args.filter(arg => arg.isEntity)
    return entityArgs[Math.floor(Math.random()*entityArgs.length)]
  }
}
Sentence.prototype.isSentence = true
module.exports = Sentence
