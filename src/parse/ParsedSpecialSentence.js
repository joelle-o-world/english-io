class ParsedSpecialSentence {
  constructor({args, syntax}, dictionary, ctx) {
    this.args = args
    this.syntax = syntax
    this.dictionary = dictionary
    this.ctx = ctx
  }

  start(domain, dictionary, ctx) {
    if(this.syntax.start)
      this.syntax.start(this.args, domain, dictionary, ctx)
    else {
      console.warn(
        'Unable to start special sentence because the syntax has no start function defined'
      )
    }
  }
  
  get imperative() {
    return this.args.some(arg => arg.imperative)
  }
}
ParsedSpecialSentence.prototype.isParsedSpecialSentence = true
ParsedSpecialSentence.prototype.isSpecialSentence = true
module.exports = ParsedSpecialSentence
