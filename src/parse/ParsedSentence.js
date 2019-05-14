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
}
module.exports = ParsedSentence
