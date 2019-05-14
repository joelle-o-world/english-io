const NounPhrase = require('./NounPhrase')

class PronounNounPhrase extends NounPhrase {
  constructor({pronoun, str}, dictionary, ctx) {
    super(dictionary, ctx)
    this.pronoun = pronoun
    this.str = str
  }

  spawn(domain, dictionary=this.dictionary, ctx=this.ctx) {
    throw 'A PronounNounPhrase cannot be spawned.'
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    let e = ctx.parse(this.pronoun)
    if(e)
      yield e
    return
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    return ctx.parse(this.pronoun) == e
  }
}
module.exports = PronounNounPhrase
