const ordinal = require('integer-to-ordinal-english')

/**
 * A class used to keep track of context specific terms and mention-histories
 * @class DescriptionContext
 * @constructor
 */

class DescriptionContext {
  constructor() {
    /**
     * list of recent noun-phrase references to objects.
     * @property {Array} referenceHistory
     */
    this.referenceHistory = []
    // Eg/ {entity: [Entity], str:'a cat'}

    /**
     * @property {Entity or null} me
     * @default `null`
     */
    this.me = null // who is the first person

    /**
     * @property {Entity or null} you
     * @default `null`
     */
    this.you = null // who is the second person
  }

  duplicate() {
    let newCtx = new DescriptionContext()
    newCtx.referenceHistory = this.referenceHistory.slice()
    newCtx.me = this.me
    newCtx.you = this.you
    newCtx.it = this.it
    newCtx.her = this.her
    newCtx.him = this.him
    newCtx.them = this.them
    newCtx.us = this.us
    return newCtx
  }

  /**
   * log a reference to the history
   * @method log
   * @param {Entity} entity
   * @param {String} str
   */
  log(entity, str) {
    this.referenceHistory.push({entity: entity, ref:str})

    if(entity.is_a('person')) {
      if(entity.pronoun == 'her')
        this.her = (this.her && this.her != entity ? undefined : entity)
      else if (entity.pronoun == 'them')
        this.them = this.them && this.them != entity ? undefined : entity
      else if (entity.pronoun == 'him')
        this.him = (this.him && this.him != entity ? undefined : entity)
    }/* else
      this.it = this.it ? undefined : entity*/
  }

  /**
   * get the pronoun of a given entity with respect to this context
   * @method getPronounFor
   * @param {Entity} entity
   * @return {String} "it", "me", "you", "her", "them" or "him"
   */
  getPronounFor(entity) {
    if(entity == this.it)
      return 'it'
    if(entity == this.me)
      return 'me'
    if(entity == this.you)
      return 'you'
    if(entity == this.her)
      return 'her'
    if(entity == this.them)
      return 'them'
    if(entity == this.him)
      return 'him'
  }

  /**
   * @method parse
   * @param {String} str
   * @return {Entity}
   */
  parse(str) {
    switch(str) {
      case 'me': return this.me;
      case 'you': return this.you;
      case 'it': return this.it;
      case 'him': return this.him;
      case 'he': return this.him;
      case 'her': return this.her;
      case 'she': return this.her;
      case 'them': return this.them;
      case 'they': return this.them;
    }
  }

  latestMentionOf(entity) {
    for(let i=this.referenceHistory.length-1; i>=0; i--)
      if(this.referenceHistory[i].entity == entity)
        return this.referenceHistory[i].ref

    return null
  }

  lastNounPhraseletMatch(phraselet) {
    for(let i=this.referenceHistory.length-1; i>=0; i--) {
      let e = this.referenceHistory[i].entity
      if(e.matchesPhraselet(phraselet))
        return e
    }

    return null
  }

  nounPhraseletMatchIndex(e, phraselet) {
    let alreadyseen = []
    for(let {entity} of this.referenceHistory) {
      if(alreadyseen.includes(entity))
        continue
      if(entity.matchesPhraselet(phraselet)) {
        if(entity == e)
          return alreadyseen.length
        else
          alreadyseen.push(entity)
      }
    }

    return -1
  }

  nounPhraseletMatches(phraselet) {
    let list = []
    for(let {entity} of this.referenceHistory) {
      if(list.includes(entity))
        continue
      else if(entity.matchesPhraselet(phraselet))
        list.push(entity)
    }

    return list
  }

  getOrdinalAdjectives(entity, phraselet) {
    let matches = this.nounPhraseletMatches(phraselet)
    let n = matches.indexOf(entity)
    if(n != -1 && matches.length > 1) {
      return [ordinal(n+1).toLowerCase()]
    } else
      return null
  }

  getArticles(entity, phraselet) {
    // if the entity has been mentioned before, use 'the'
    if(this.latestMentionOf(entity)) {
      /*if(this.lastNounPhraseletMatch(phraselet) == entity)
        return ['this']
      else*/
      return ['the']
    } else {
      if(this.lastNounPhraseletMatch(phraselet))
        return ['another']
      else
        return ['a']
    }
  }


}
module.exports = DescriptionContext
