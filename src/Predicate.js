const PredicateSyntax = require('./PredicateSyntax')

/**
  @class Predicate
  @constructor
  @param {Object} [options] Options for constructing the predicate.
  @param {String} [options.verb] The verb of the predicate.
  @param {Array}  [options.params]
  @param {Array}  [options.forms] Alternatively multiple syntaxes can be defined using an
                         array of verb/params/constants objects.
  @param {Function} [options.skipIf]
  @param {Function} [options.replace]
  @param {Function} [options.prepare]
  @param {Function} [options.problem]
  @param {Function} [options.check]
  @param {Function} [options.begin]
  @param {Function} [options.meanwhile]
  @param {Function} [options.expand]
  @param {Function} [options.until]
  @param {Function} [options.afterwards]
  @param {Boolean}  [options.banal=false]
  @param {Boolean}  [options.actionable=true] Can the predicate be used treated as an imperative instruction?
*/

class Predicate {
  constructor({
    // syntax(s) description
    verb, params=['subject'], // used if initialising with only one form
    forms=[],
    // semantic functions
    begin, expand, check, until, afterwards, prepare, skipIf, replace, problem, meanwhile,
    banal=false, actionable=true,
  }) {
    // if verb and params are given, initialise with one form
    if(verb && params)
      forms.unshift({verb: verb, params:params})

    // initialise forms as PredicateSyntax objects
    this.forms = forms.map(form => new PredicateSyntax(form))

    // check that form parameters agree
    this.params = this.forms[0].params.map(param => {
      return {
        literal: param.literal
      }
    })
    for(let syntax of this.forms) {
      if(syntax.params.length != this.params.length)
        throw 'Predicate has incompatible forms'
      for(let i in syntax.params)
        if(syntax.params[i].literal != this.params[i].literal)
          throw 'Predicate has incompatible forms'
    }

    // sort forms by specificness
    this.forms = this.forms.sort((A, B) => B.specificness - A.specificness)
    // overall specificness is the maximum specificness of the predicates forms
    this.specificness = this.forms[this.forms.length-1].specificness

    // semantic functions:
    /**
      `skipIf` is called as when starting a sentence. If it returns a truthy
      value then the sentence will cancel starting and won't happen. Should
      generally be used to check whether an action is unnecessary because its
      outcome is already true.
      @property {Function} skipIf
    */
    this.skipIf = skipIf

    /**
     * `replace` is called when starting a sentence. If it returns a truthy
     * value then the sentence will cancel starting and won't happen. The
     * returned sentences will be started instead. Should be used to correct
     * lazy user input.
     */
    this.replace = replace

    /**
      `_prepare` is called before a sentence happens. If it returns a sentence
      or list of sentences, these sentences will be executed consequetively
      before the original sentence happens.
      @property {Function} _prepare
    */
    this._prepare = prepare

    /**
     * Problem returns truthy if the sentence is illegal.
     * @property {Function} problem
     */
    this.problem = problem

    /**
     `check` is called to decide whether it is necessary to call `_begin`.
      If it returns truthy then `_begin` will be skipped, the start process
      will not be cancelled however. Its secondary purpose is for answering
      question sentences (true/false) when they have not been specifically
      declared as sentences.
      @property {Function} check
    */
    this.check = check

    /**
      * `_begin` is called directly after the sentence happens. So far, the
      * return value is ignored.
      * @property {Function} _begin
      */
    this._begin = begin

    /**
     * `meanwhile` is called directly after a sentence happens (after `_begin`)
     * if it returns a sentence, or list of sentences, these will be started
     * using the original sentence as a cause. In other words, they will be
     * stopped as soon the original sentence finishes.
     */
    this.meanwhile = meanwhile

    /**
      * `_expand` works in a similar way to `_prepare` except it is called
      * immediately after a sentence happens. If it returns a sentence, or an
      * array of sentences, these will be executed consequetively and the main
      * sentence will be stopped after the last one finishes.
      * @property {Function} _expand
      */
    this._expand = expand

    /**
      * `until` is called immediately after a sentence happens (after
      * `_expand`). It has an additional callback arguemnt (prepended) which,
      * when called will stop the sentence.
      * @property {Function} until
      */
    this.until = until

    /**
      * `_afterwards` is immediately after the sentence stops. If it returns a
      * sentence or an array of sentences, these will be executed simultaneously
      * @property {Function} _afterwards
      */
    this._afterwards = afterwards

    /**
     * If a predicate is marked banal, sentences using it will be ignored by
     * certain processes to do with story telling.
     * @property {Boolean} banal
     * @default false
     */
     this.banal = banal

    /**
     * If a predicate is marked actionable it can be parsed as an imperative
     * instruction.
     * @property {Boolean} actionable
     * @default true
     */
     this.actionable = actionable
  }

  /**
   * Checks whether a given list of arguments are of the right type to fit the
   * parameters of a predicate.
   * @method checkArgs
   * @param {Array} args
   * @return {Boolean}
   */
  checkArgs(args) {
    if(this.params.length != args.length) {
      console.warn('wrong number of arguments!')
      return false // whoops, wrong number of arguments!
    }

    for(let i in args) {
      let arg = args[i]
      if(this.params[i].literal) {
        // parameter is flagged literal so argument should be a string
        if(arg.constructor == String)
          continue
        else {
          return false
        }

      } else if(arg.isEntity)
        // non-literal args must be a Entity or a NounPhraseSentence
        continue
      else if(arg.isNounPhraseSentence && arg.checkArgs())
        continue
    }

    // we got to the end, so the arguments are legal
    return true
  }

  /** Prase a string against a given list of tenses
      @method parse
      @param {String} str The String to parse
      @param {Array} tenses List of tenses to parse the string against
      @return {Sentence}
        A sentence with string placeholders as arguments or null (if cannot be
        parsed)
  */
  parse(str, tenses) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parse(str, tenses)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
    return null
  }

  /**
      Parses a string using the imperative tense, for a given subject
      @method parseImperative
      @param {String} str The NL string to be parsed.
      @param {Entity} subject The subject of the sentence.
      @return {Sentence}
        A sentence with string placeholders as arguments (except the subject)
        or `null` in the case that the string cannot be parsed.
  */
  parseImperative(str, subject) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parseImperative(str, subject)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
    return null
  }

  /**
   * Parses a string in noun phrase form, referring to one of the arguments.
   * For example, "The cup that is on the table".
   * @method parseNounPhrase
   * @param {String} str The string to be parsed
   * @return {Sentence} A sentence with string placeholders as arguments, or
                        `null` in the case that the string cannot be parsed.
   */
  parseNounPhrase(str) {
    for(let form=0; form<this.forms.length; form++) {
      let syntax = this.forms[form]
      let interpretation = syntax.parseNounPhrase(str)
      if(interpretation) {
        interpretation.predicate = this
        interpretation.form = form
        return interpretation
      }
    }
  }

  /**
   * Generate an english string version of the predicate for a given set of
   * arguments in a given tense.
   * @method str
   * @param {Object} details
   * @param {Array} details.args
   *  The list of arguments for the sentence.
   * @param {String} [details.tense = "simple_present"]
   *  The tense in which to compose the sentence. (see verbPhrase.js)
   * @param {Number} [details.form = 0]
   *  The index of the syntactic form to be used (for predicates with multiple
   *  forms)
   * @param {DescriptionContext} [ctx]
   *  An object describing the context for which the string is being generated.
   * @param {Object} [options]
   *  The entityStr options, dictating preferences for how entity arguments should
   *  be written.
   * @return {String} The written sentence.
   */
  str({args, tense, form}, ctx, options) {
    return this.compose({args:args, tense:tense, form:form}).str(ctx, options)
  }

  /**
   * Prepare an english version of the predicate for a given set of
   * arguments in a given tense.
   * @method compose
   * @param {Object} details
   * @param {Array} details.args
   *  The list of arguments for the sentence.
   * @param {String} [details.tense = "simple_present"]
   *  The tense in which to compose the sentence. (see verbPhrase.js)
   * @param {Number} [details.form = 0]
   *  The index of the syntactic form to be used (for predicates with multiple
   *  forms)
   * @param {Object} verbPhraseOptions
   * @return {Substitution} A substitution ready to format the sentence.
   */
  compose({args, tense, form}, verbPhraseOptions) {
    if(form == undefined)
      form = Math.floor(Math.random()*this.forms.length)
    return this.forms[form].compose(
      {args:args, tense:tense},
      verbPhraseOptions,
    )
  }

  /**
   * Generate a set of preposition clauses for a particular argument.
   * @method presentPrepositionClausesFor
   * @param {Number} argIndex
   *  The index of of the argument to generate clauses for.
   * @param {Array} args The complete list of arguments.
   * @return {Array}
   *  An array of preposition (string) clause (substitution) pairs.
   */
  presentPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let syntax of this.forms)
      list.push(...syntax.presentPrepositionClausesFor(argIndex, args))

    return list
  }

  /**
   * Generate a set of preposition clauses for a particular argument in the
   * past tense.
   * @method pastPrepositionClausesFor
   * @param {Number} argIndex
   *  The index of of the argument to generate clauses for.
   * @param {Array} args The complete list of arguments.
   * @return {Array}
   *  An array of preposition (string) clause (substitution) pairs.
   */
  pastPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let syntax of this.forms)
      list.push(...syntax.pastPrepositionClausesFor(argIndex, args))

    return list
  }


  /**
   * A list contiaining a camelCase names for each form of this Predicate.
   * @attribute names
   * @readOnly
   */
  get names() {
    let list = []
    for(let form of this.forms) {
      list.push(form.camelCaseName)
    }
    return list
  }

  /**
   * Returns a random PredicateSyntax form belonging to this Predicate.
   * @method randomForm
   * @returns {PredicateSyntax}
   */
  randomForm() {
    return this.forms[Math.floor(Math.random()*this.forms.length)]
  }
}
Predicate.prototype.isPredicate = true
module.exports = Predicate
