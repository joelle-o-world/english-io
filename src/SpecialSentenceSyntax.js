const SpecialSyntax = require('./SpecialSyntax')
const ParsedSpecialSentence = require('./parse/ParsedSpecialSentence')


class SpecialSentenceSyntax extends SpecialSyntax {
  constructor(template, {start, stop}={}) {
    super(template)

    this._start = start
    this._stop = stop
  }

  parseSentence(str, ctx, subject) {
    let args = this.parse(str, ctx, subject)
    return new ParsedSpecialSentence({
      args: args,
      syntax: this,
    }, this.dictionary, ctx)
  }
}
module.exports = SpecialSentenceSyntax
