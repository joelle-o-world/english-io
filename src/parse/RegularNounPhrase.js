const NounPhrase = require('./NounPhrase')
const uniqueCombine = require('../util/uniqueCombine')
const {explore} = require('../search')

class RegularNounPhrase extends NounPhrase {
  constructor(info, dictionary, ctx) {
    super(dictionary, ctx)

    Object.assign(this, info)
  }

  spawn(domain, dictionary=this.dictionary, ctx=this.ctx) {
    let {
      noun,
      min, max,
      adjectives,
      owner,
      str,
    } = this

    if(max == Infinity)
      max = infinityValue
    let n = min + Math.floor(Math.random()*(max-min+1))

    // create owner
    let ownerEntity
    if(owner) {
      if(!dictionary.declareOwnership)
        throw 'Unable to spawn \"' + str + '\" because dictionary\'s .declareOwnership() function is undefined.'

      ownerEntity = owner.findOrSpawn(domain, dictionary, ctx)[0]
    }

    let list = []
    for(let i=0; i<n; i++) {
      // Create a new entity.
      let e = dictionary.createEntity()

      // Set the noun.
      e.be_a(noun.noun)

      // Apply the adjectives.
      for(let adj of adjectives)
        e.be(adj)

      // Apply ownership.
      if(owner && ownerEntity)
        dictionary.declareOwnership(ownerEntity, e)

      list.push(e)
    }

    return list
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    if(domain.isEntity)
      domain = [...explore([domain])]

    if(ctx)
      domain = uniqueCombine(
        ctx.referenceHistory.map(ref => ref.entity),
        domain,
      )

    if(this.min > 1 || this.max > 1)
      console.warn('parseNounPhrase.find does not take account of quantifiers')

    if(this.ordinal) {
      let n = 1
      for(let e of domain)
        if(this.matches(e, dictionary, ctx) && n++ == this.ordinal) {
          yield e
          return
        }
    } else
      for(let e of domain)
        if(this.matches(e, dictionary, ctx))
          yield e
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    // REGULAR NOUN PHRASE
    let {
      noun,
      adjectives,
      owner,
    } = this


    // Noun must match.
    if(!e.is_a(noun.noun))
      return false


    // All adjectives must match.
    for(let adj of adjectives) {
      if(!e.adjectives.includes(adj))
        return false
    }

    // Owner must match
    if(owner) {
      if(dictionary.getOwners) {
        if(!dictionary.getOwners(e).some(f => owner.match(f, dictionary, ctx)))
          return false
      } else
        throw 'Unable to find \"' + this.str + '\" because dictionary.getOwners() is not defined'
    }

    // Otherwise,
    return true
  }
}
module.exports = RegularNounPhrase
