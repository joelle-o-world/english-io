const Sentence = require('../Sentence')

class ParsedSentence {
  constructor(
    {tense, args, syntax, predicate=syntax.predicate},
    dictionary, ctx
  ) {
    this.tense = tense
    this.predicate = predicate
    this.args = args
    this.syntax = syntax

    this.dictionary = dictionary
    this.ctx = ctx
  }

  duplicate() {
    return new ParsedSentence({
      tense: this.tense,
      predicate: this.predicate,
      syntax: this.syntax,
      args: this.args.slice()
    }, this.dictionary, this.ctx)
  }

  get imperative() {
    return this.tense == 'imperative'
  }

  get subject() {
    if(this.syntax.paramsByName._subject)
      return this.args[this.syntax.paramsByName._subject.index]
    else
      return null
  }

  set subject(subject) {
    if(this.syntax.paramsByName._subject) {
      console.log(this.syntax.paramsByName._subject.index)
      this.args[this.syntax.paramsByName._subject.index] = subject
    } else
      throw 'ParsedSentence no subject parameter'
  }

  matches(sentence, ignoreArgIndex) {
    // Does this ParsedSentence match the given actualised Sentence object
    // do the predicates match?
    if(this.predicate != sentence.predicate)
      return false

    // TODO: tense checking

    for(let i in this.args) {
      if(i == ignoreArgIndex)
        continue

      if(this.args[i].isNounPhrase) {
        if(!this.args[i].matches(sentence.args[i]))
          return false
      } else if(this.args[i] != sentence.args[i])
        return false
    }
    // Otherwise,
    return true
  }

  create(domain=[], dictionary=this.dictionary, ctx=this.ctx) {
    let args = this.args.map(arg => {
      if(arg.isNounPhrase)
        return arg.findOrSpawn(domain, dictionary, ctx)[0]
      else
        return arg
    })

    let sentence = new Sentence(this.predicate, args)

    return sentence
  }
}
ParsedSentence.prototype.isParsedSentence = true
module.exports = ParsedSentence
