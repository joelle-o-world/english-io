const ParsedSentence = require('./parse/ParsedSentence')

const SpecialSyntax = require('./SpecialSyntax')

class SpecialPredicateSyntax extends SpecialSyntax {
  constructor(present, tense='simple_present') {
    super(present)
    this.tense = tense
    this.predicate
  }

  parseSentence(str, ctx) {
    let args = this.parse(str, ctx)
    return new ParsedSentence({
      tense: this.tense,
      args: args,
      predicate: this.predicate,
      syntax: this,
    }, this.dictionary, ctx)
  }
}
module.exports = SpecialPredicateSyntax
