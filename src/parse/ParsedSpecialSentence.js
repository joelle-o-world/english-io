class ParsedSpecialSentence {
  constructor({args, syntax}, dictionary, ctx) {
    this.args = args
    this.syntax = syntax
    this.dictionary = dictionary
    this.ctx = ctx
  }
}
module.exports = ParsedSpecialSentence
