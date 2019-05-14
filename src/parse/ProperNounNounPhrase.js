const NounPhrase = require('./NounPhrase')
const uniqueCombine = require('../util/uniqueCombine')
const {explore} = require('../search')

class ProperNounNounPhrase extends NounPhrase {
  constructor({properNoun, str}, dictionary, ctx) {
    super(dictionary, ctx)
    this.properNoun = properNoun
    this.str = str
  }

  spawn(dictionary=this.dictionary, ctx=this.ctx) {
    throw 'A ProperNounNounPhrase cannot be spawned.'
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    if(domain.isEntity)
      domain = [...explore([domain])]

    if(ctx)
      domain = uniqueCombine(
        ctx.referenceHistory.map(ref => ref.entity),
        domain,
      )

    for(let e of domain)
      if(this.matches(e, dictionary, ctx))
        yield e
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    return e.properNouns.includes(this.properNoun)
  }
}
module.exports = ProperNounNounPhrase
