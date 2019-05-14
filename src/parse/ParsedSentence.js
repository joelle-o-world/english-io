class ParsedSentence {
  constructor({tense, args, syntax, predicate=syntax.predicate}) {
    this.tense = tense
    this.predicate = predicate
    this.args = args
    this.syntax = syntax
  }
}
module.exports = ParsedSentence
