/*
  This is a bit like an entitiy, but it doesn't have the same symbollic value.
  It just represents a noun-phrase to be tested against a domain or spawned
*/

const infinityValue = 100
const uniqueCombine = require('../util/uniqueCombine')

class NounPhrase {
  constructor(dictionary, ctx) {
    this.dictionary = dictionary
    this.ctx = ctx
  }

  spawn(dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.spawn() not defined for', this.constructor.name)
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.find() not defined for', this.constructor.name)
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.matches() not defined for', this.constructor.name)
  }
}
module.exports = NounPhrase
