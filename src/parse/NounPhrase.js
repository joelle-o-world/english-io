/*
  This is a bit like an entitiy, but it doesn't have the same symbollic value.
  It just represents a noun-phrase to be tested against a domain or spawned
*/

const infinityValue = 100
const uniqueCombine = require('../util/uniqueCombine')

class NounPhrase {
  constructor(type, info, dictionary, ctx) {
    this.dictionary = dictionary
    this.ctx = ctx
    this.type = type

    Object.assign(this, info)
  }

  spawn(dictionary=this.dictionary, ctx=this.ctx) {
    // Ignoring owners
    if(this.type == 'np') {
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
        ownerEntity = owner.spawn(dictionary)
        if(!dictionary.declareOwnership)
          throw 'Unable to spawn \"' + str + '\" because dictionary\'s .declareOwnership() function is undefined.'
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
    } else
      throw 'cannot spawn noun phrases of type: '+this.type
  }

  *find(domain, dictionary=this.dictionary, ctx=this.ctx) {
    if(this.type == 'np') {
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
  }

  matches(e, dictionary=this.dictionary, ctx=this.ctx) {
    if(this.type == 'np') {
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
          throw 'Unable to find \"' + str + '\" because dictionary.getOwners() is not defined'
      }

      // Otherwise,
      return true

    } else
      throw 'cannot match noun phrases of type: '+this.type
  }
}
module.exports = NounPhrase
