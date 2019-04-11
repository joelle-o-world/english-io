const spawn = require('./spawn')
const regOps = require('./util/regOps')
const PredicateSet = require('./PredicateSet')
const Sentence = require('./Sentence')
const NounPhraseSentence = require('./NounPhraseSentence')
const {getTenseType} = require('./util/conjugate/verbPhrase')
const DescriptionContext = require("./DescriptionContext")
const search = require('./search')

class Declarer {
  constructor(dictionary) {
    this.entitys = [] // an iterator of Entity objects
    this.ctx = new DescriptionContext()
    this.dictionary = dictionary
  }

  findOrSpawn(nounPhraseStr) {
    let entity = this.findFirst(nounPhraseStr)
    if(!entity)
      entity = spawn(this.dictionary, nounPhraseStr)

    return entity
  }

  findFirst(matchStr) {
    for(let entity of this.find(matchStr))
      return entity
  }

  *find(matchStr, searchLimit=1000) {
    let ctxMatch = this.ctx.parse(matchStr)
    if(ctxMatch)
      return ctxMatch

    for(let match of search(matchStr, this.entitys))
      yield match
  }

  parseNounPhrase(str) {
    // first check for a simple solution
    let simple = this.findOrSpawn(str)
    if(simple)
      return simple

    // otherwise parse it as a noun phrase using the predicates
    let interpretations = this.predicates.parseNounPhrase(str)

    // filter interpretations by tense
    interpretations = interpretations.filter(I => I.tense == 'simple_present')

    // try to find sub-nounPhrases for each possibility until a solution is found
    for(let {args, predicate, paramIndex, tense} of interpretations) {
      let solutionArgs = []
      for(let i in args) {
        if(predicate.params[i].literal)
          // pass literal args straight through
          solutionArgs[i] = args[i]
        else
          solutionArgs[i] = this.parseNounPhrase(args[i])
      }

      if(!solutionArgs.includes(null)) {
        return new NounPhraseSentence(paramIndex, predicate, solutionArgs)
      }
    }


    return null
  }

  declareNounPhrase(strOrSolution) {
    // if passed a string, parse it first
    let solution
    if(strOrSolution.constructor == String)
      solution = this.parseNounPhrase(strOrSolution)
    else
      solution = strOrSolution


    // return null is failed to parse string or if passed null
    if(!solution)
      return null

    if(solution.isNounPhraseSentence) {
      let recursiveArgs = solution.recursiveEntityArgs
      for(let arg of recursiveArgs)
        this.addEntity(arg)

      solution.start()

      return solution.mainArgument
    } else {
      if(solution.isEntity)
        this.addEntity(solution)
      return solution
    }

    return null
  }

  addEntity(entity) {
    // add a Entity to the entitys
    if(!entity.isEntity)
      console.warn('adding a entity which is not a entity')

    if(entity.isEntity && !this.entitys.includes(entity)) {
      this.entitys.push(entity)
    }
  }

  parse(declarationStr, tenses, forbidSpawn=false) {
    let interpretations = this.predicates.parse(declarationStr, tenses)

    for(let {args, predicate, tense} of interpretations) {
      for(let i in args) {
        let arg = args[i]
        if(!predicate.params[i].literal) {
          if(forbidSpawn)
            args[i] = this.findFirst(arg)
          else
            args[i] = this.parseNounPhrase(arg)
        }
      }

      if(args.includes(null) || args.includes(undefined))
        continue
      else {
        let sentence = new Sentence(predicate, args)//{args, predicate, tense}
        sentence.source = 'parsed'
        sentence.parsed_tense = tense
        return sentence
      }
    }

    // if we get here, we have failed
    return null
  }

  parseImperative(declarationStr, subject, forbidSpawn=false) {
    let interpretations = this.predicates.parseImperative(declarationStr, subject)

    for(let {args, predicate, tense} of interpretations) {
      for(let i in args) {
        let arg = args[i]
        if(!predicate.params[i].literal) {
          if(forbidSpawn)
            args[i] = this.findFirst(arg)
          else
            args[i] = this.parseNounPhrase(arg)
        }
      }

      if(args.includes(null) || args.includes(undefined))
        continue
      else {
        let sentence = new Sentence(predicate, args)//{args, predicate, tense}
        sentence.source = 'parsed'
        sentence.parsed_tense = tense
        return sentence
      }
    }

    // if we get here, we have failed
    return null
  }

  declare(...declarationStrings) {
    for(let str of declarationStrings) {
      let sentence = this.parse(str)

      if(!sentence /*|| info.tense != 'simple_present'*/) {
        console.warn('DECLARATION FAILED:', str)
        return null
      }

      let tenseType = getTenseType(sentence.parsed_tense)

      if(tenseType == 'present') {
        let entitysToAdd = sentence.recursiveEntityArgs
        for(let entity of entitysToAdd)
          this.addEntity(entity)

        sentence.start()

      } else if(tenseType == 'past') {
        let entitysToAdd = sentence.recursiveEntityArgs
        for(let entity of entitysToAdd)
          this.addEntity(entity)

        sentence.start()
        sentence.stop()
      } else {
        console.warn('declaration with strange tense:', sentence.parsed_tense)
      }
    }
    return this
  }

  check(str) {
    let sentence = this.parse(str, undefined, true)

    if(!sentence) {
      //console.warn("CHECK FAILED, couldn't parse:", str)
      return false
    }

    let tenseType = getTenseType(sentence.parsed_tense)

    if(tenseType == 'present')
      return sentence.trueInPresent()
    else if(tenseType == 'past')
      return sentence.trueInPast()
    else
      return undefined

  }

  printEntityList() {
    return this.entitys.map(entity => entity.ref())
  }
  randomEntity() {
    return this.entitys[Math.floor(Math.random()*this.entitys.length)]
  }
  randomFact() {
    return this.randomEntity().randomFact()
  }
  randomSentence() {
    return this.randomEntity().randomSentence()
  }
  randomPredicate() {
    return this.predicates.random()
  }

  get predicates() {
    return this.dictionary.predicates
  }
}
module.exports = Declarer
