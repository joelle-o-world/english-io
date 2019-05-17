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

  spawn(domain, dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.spawn() not defined for', this.constructor.name)
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.find() not defined for', this.constructor.name)
  }

  findFirst(domain, dictionary, ctx) {
    for(let e of this.find(domain, dictionary, ctx))
      return e

    // Otherwise,
    return null
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    console.warn('.matches() not defined for', this.constructor.name)
  }

  findOrSpawn(domain, dictionary=this.dictionary, ctx=this.ctx) {
    // first try to find it:
    for(let e of this.find(domain, dictionary, ctx))
      return [e]

    // if unsuccessful, spawn it:
    let spawned = this.spawn(domain, dictionary, ctx)
    if(spawned)
      return spawned
    else
      return null
  }
}
NounPhrase.prototype.isNounPhrase = true
module.exports = NounPhrase
