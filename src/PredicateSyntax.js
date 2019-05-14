/**
  A class for representing a single syntactic 'form' of a predicate.
  @class PredicateSyntax
  @constructor
  @param {Object} options
  @param {String} options.verb
  @param {Array} options.params
  @param {Array} options.constants
  @param {Array} [options.presentTenses]
  @param {Array} [options.pastTenses]
*/

const verbPhrase = require('./util/conjugate/verbPhrase')

const usefulTenses = ['simple_present', 'simple_past']//verbPhrase.tenseList
// ^ (must be in reverse order of specificness)

const Sentax = require('./Sentax')
const ParsedSentence = require('./parse/ParsedSentence')
const parseNounPhrase = require('./parse/parseNounPhrase')


class PredicateSyntax {
  constructor({
    verb, params=['subject'], constants={},
    presentTenses=['simple_present'],
    pastTenses=['simple_past'],
  }) {
    /**
     * @property {String} verb
     */
    this.verb = verb

    if(constants.subject) {
      constants._subject = constants.subject
      delete constants.subject
    }
    if(constants.object) {
      constants._object = constants.object
      delete constants.object
    }
    /**
     * @property {Array} constants
     */
    this.constants = constants

    /**
     *  The params assign the syntactic function of the arguments.
     * @property {Array} params
     */
    this.params = params.map((param, i) => {
      if(param.constructor == String) {
        let literal = false
        if(param[0] == '@') {
          literal = true
          param = param.slice(1)
        }

        if(param == 'subject')
          param = '_subject'
        if(param == 'object')
          param = '_object'

        return {
          name: param,
          literal: literal,
          index: i
        }
      }
    })

    /**
     * The param objects indexed by name.
     * @property {Object} paramsByName
     */
    this.paramsByName = {}
    for(let param of this.params)
      this.paramsByName[param.name] = param
    /**
     * @property {String} camelCaseName
     */
    // generate camel case name
    let words = [
      ...this.verb.split(/_| /)
    ]
    for(let param of this.params)
      if(param.name[0] != '_')
        words.push(...param.name.split(/_| /))

    this.camelCaseName = words.map(word => word[0].toUpperCase()+word.slice(1)).join('')


    // set-up regexs
    this.regexs = {}
    this.makeParamRegexs()
    // calculate specificness
    this.getSpecificness()

    // tenses
    this.presentTenses = presentTenses
    this.pastTenses = pastTenses
  }

  /**
   * Convert an associated arguments object (indexed by param-name) into an
   * ordered argument list
   * @method orderArgs
   * @param {Object} associativeArgs
   * @return {Array} Ordered args.
   */
  orderArgs(associativeArgs={}) {
    let orderedArgs = []
    for(let {name} of this.params)
      orderedArgs.push(associativeArgs[name])
    return orderedArgs
  }

  /**
   * Convert an ordered list of arguments into an associated arguments object
   * (indexed by param-name).
   * @method associateArgs
   * @param {Array} orderedArgs
   * @return {Object}
   */
  associateArgs(orderedArgs) {
    let associativeArgs = {}
    for(let i in this.params)
      associativeArgs[this.params[i].name] = orderedArgs[i]
    return associativeArgs
  }

  /**
   * @method makeRegex
   * @param {String} tense
   * @param {Object} options Options for verbPhrase
   */
  makeRegex(tense, options) {
    if(!this.capturingAction){
      let action = {_verb: this.verb}
      for(let {name} of this.params) {
        action[name] = '(?<'+name+'>.+)'
      }
      for(let name in this.constants) {
        action[name] = this.constants[name]
      }
      this.capturingAction = action
    }

    let vp = verbPhrase(this.capturingAction, tense, options)

    return new RegExp('^'+vp.str()+'$')
  }

  regex(tense) {
    if(!this.regexs[tense])
      this.regexs[tense] = this.makeRegex(tense)

    return this.regexs[tense]
  }

  /**
   * @method makeParamRegexs
   */
  makeParamRegexs() {
    for(let param of this.params) {
      let {name, literal} = param
      if(literal)
        continue
      param.regexs = {}
      for(let tense of usefulTenses) {
        let reg = this.makeRegex(tense, {nounPhraseFor:name})
        param.regexs[tense] = reg
      }
    }
  }

  /**
   * @method parse
   * @param {String} str
   * @param {Array} [tenses]
   * @return {Object}
   */
  parse(str, tenses=[...this.presentTenses, ...this.pastTenses]) {
    for(let tense of tenses) {
      if(!this.regexs[tense])
        this.regexs[tense] = this.makeRegex(tense)
      let reg = this.regexs[tense]
      let result = reg.exec(str)
      if(result)
        return {
          tense: tense,
          args: this.orderArgs(result.groups),
          predicate: this,
        }
    }

    return null
  }

  parseSentence(str, ctx) {
    let tenses=[...this.presentTenses, ...this.pastTenses]
    for(let tense of tenses) {
      if(!this.regexs[tense])
        this.regexs[tense] = this.makeRegex(tense)
      let reg = this.regexs[tense]
      let result = reg.exec(str)
      if(result) {
        let args = this.orderArgs(result.groups)
        let failed = false
        for(let i in args)
          if(this.params[i].literal)
            continue

          else if(this.params[i].number) {
            args[i] = parseFloat(args[i])
            if(isNaN(args[i])) {
              failed = true
              break
            }
          } else {
            args[i] = parseNounPhrase(args[i], this.dictionary, ctx)
            if(!args[i]) {
              failed = true
              break
            }
          }

        if(!failed)
          return new ParsedSentence({
            tense: tense,
            args: args,
            predicate: this.predicate,
            syntax: this,
          }, this.dictionary, ctx)
      }
    }

    return null
  }

  parseImperativeSentence(str, subject, ctx) {
    let reg = this.regex('imperative')
    let result = reg.exec(str)
    if(result) {
      result.groups._subject = subject
      let args = this.orderArgs(result.groups)

      for(let i in args)
        if(this.params[i].name == '_subject')
          continue

        else if(this.params[i].literal)
          continue

        else if(this.params[i].number) {
          args[i] = parseFloat(args[i])
          if(isNaN(args[i]))
            return null
        }

        else {
          args[i] = parseNounPhrase(args[i], this.dictionary, ctx)
          if(!args[i])
            return null
        }

      // Otherwise,
      return new ParsedSentence({
        tense: 'imperative',
        args: args,
        syntax: this,
        predicate: this.predicate,
      }, this.dictionary, ctx)
    }

    return null
  }

  parseEmbeddedSentence(str, ctx) {
    for(let param of this.params) {
      for(let tense in param.regexs) {
        let reg = param.regexs[tense]
        let result = reg.exec(str)
        if(result) {
          let args = this.parseArgs(this.orderArgs(result.groups), ctx)
          if(args) {
            let sentence = new ParsedSentence({
              tense: tense,
              args: args,
              predicate:this.predicate,
              syntax:this,
            }, this.dictionary, ctx)
            let mainArgument = args[param.index]
            mainArgument.facts.push({
              fact: sentence,
              argIndex: param.index
            })
            return mainArgument
          }
        }
      }
    }
  }

  parseArgs(args, ctx) {
    args = args.slice()
    for(let i in args)
      if(this.params[i].literal) {
        if(args[i].constructor == String)
          continue
        else
          return null
      }

      else if(this.params[i].number) {
        args[i] = parseFloat(args[i])
        if(isNaN(args[i]))
          return null
      }

      else {
        args[i] = parseNounPhrase(args[i], this.dictionary, ctx)
        if(!args[i])
          return null
      }

    return args
  }

  /**
   * @method parseImperative
   * @param {String} str
   * @param {Entity} subject
   * @return {Object}
   */
  parseImperative(str, subject) {
    // Parse an imperative string for a given subject

    // call parse using imperative tense
    let parsed = this.parse(str, ['imperative'])

    // set the subject argument to the given subject
    if(parsed && this.paramsByName._subject)
      parsed.args[this.paramsByName._subject.index] = subject

    return parsed
  }

  /**
   * @method parseNounPhrase
   * @param {String} str
   * @return {Object}
   */
  parseNounPhrase(str) {
    for(let param of this.params) {
      for(let tense in param.regexs) {
        let reg = param.regexs[tense]
        let result = reg.exec(str)
        if(result)
          return {
            tense: tense,
            param: param.name,
            paramIndex: param.index,
            predicate: this,
            args: this.orderArgs(result.groups)
          }
      }
    }
  }


  /**
   * @method str
   * @param {Object} details
   * @param {Array} details.args
   * @param {String} details.tense
   * @param {DescriptionContext} ctx
   * @param {Object} options entityStr options
   * @return {String}
   */
  str({args, tense}, ctx, options) {
    return this.compose({args:args, tense:tense}).str(ctx, options)
  }

  /**
   * @method compose
   * @param {Object} details
   * @param {Array} details.args
   * @param {String} [tense = "simple_present"]
   * @param {Object} options verbPhrase options
   * @return {Substitution}
   */
  compose({args, tense='simple_present'}, options) {
    let action = this.composeAction(args)
    return verbPhrase(action, tense, options)
  }

  /**
   * @method composeAction
   * @param {Array} orderedArgs
   * @return {Object}
   */
  composeAction(orderedArgs) {
    let action = this.associateArgs(orderedArgs)
    action._verb = this.verb
    for(let name in this.constants)
      action[name] = this.constants[name]
    return action
  }

  /**
   * @method composeSentax
   * @param {Array} orderedArgs
   * @param {String} tense
   * @returns {Sentax}
   */
  composeSentax(orderedArgs, tense) {
    let args = this.associateArgs(orderedArgs)
    for(let name in this.constants)
      args[name] = this.constants[name]

    return new Sentax({
      verb: this.verb,
      args: args,
      tense: tense,
    })
  }

  /**
   * @method composeSubjectNounPhrase
   * @param {Object} details
   * @param {Array} details.args
   * @param {String} details.tense
   * @return {Substitution}
   */
  composeSubjectNounPhrase({args, tense}) {
    return this.compose({args:args, tense:tense}, {nounPhraseFor:'_subject'})
  }

  /**
   * @method composePrepositionPhraseFor
   * @param {Number} argIndex
   * @param {Object} details
   * @param {Array} details.args
   * @param {String} details.tense
   * @return {Object}
   */
  composePrepositionPhraseFor(argIndex, {args, tense}) {
    return {
      preposition:'that',
      clause :this.compose(
        {args:args, tense:tense},
        {omit:this.params[argIndex].name}
      ),
      mainArgument: args[argIndex],
    }
  }

  /**
   * @method presentPrepositionClausesFor
   * @param {Number} argIndex
   * @param {Array} args
   * @return {Array}
   */
  presentPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let tense of this.presentTenses)
      list.push(this.composePrepositionPhraseFor(
        argIndex, {args:args, tense:tense})
      )
    return list
  }

  /**
   * @method pastPrepositionClausesFor
   * @param {Number} argIndex
   * @param {Array} args
   * @return {Array}
   */
  pastPrepositionClausesFor(argIndex, args) {
    let list = []
    for(let tense of this.pastTenses)
      list.push(this.composePrepositionPhraseFor(
        argIndex, {args:args, tense:tense})
      )
    return list
  }

  /**
   *  Calculate a specificness score. Used to order predicates in PredicateSet.
   *  Low specificness should be processed last when parsing to avoid using
   *  problems.
   *  Eg to avoid using '_ is _' when '_ is in _' could have been used.
   *  @method getSpecificness
   *  @return {Number}
   */
  getSpecificness() {
    // Calculate a specificness score. Used to order predicates in PredicateSet.
    // Low specificness should be processed last when parsing to avoid using
    // problems.
    // Eg to avoid using '_ is _' when '_ is in _' could have been used.

    if(this.specificness)
      return this.specificness

    let score = this.verb.length
    for(let param of this.params) {
      if(param.name[0] != '_')
        score += param.name.length * (param.literal ? 1 : 3)
      //if(param.literal)
        //score -= 10
    }

    this.specificness = score
    return this.specificness
  }


  get hasLiterals() {
    return this.params.some(param => param.literal)
  }

  get dictionary() {
    if(this.predicate)
      return this.predicate.dictionary
  }
}
PredicateSyntax.prototype.isPredicateSyntax = true
module.exports = PredicateSyntax
