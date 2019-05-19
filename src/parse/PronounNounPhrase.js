const NounPhrase = require('./NounPhrase')

const subToOb = {
  i: 'me',
  she: 'her',
  he: 'him',
  we: 'us',
  they:'them',
}

class PronounNounPhrase extends NounPhrase {
  constructor({pronoun, str}, dictionary, ctx) {
    super(dictionary, ctx)
    pronoun = pronoun.toLowerCase()
    if(subToOb[pronoun])
      pronoun = subToOb[pronoun]
    this.pronoun = pronoun
    this.str = str
  }

  spawn(domain, dictionary=this.dictionary, ctx=this.ctx) {
    throw 'A PronounNounPhrase cannot be spawned.'
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    console.log(ctx, this.pronoun, this)
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
