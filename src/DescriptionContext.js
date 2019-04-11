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
    } else
      this.it = this.it ? undefined : entity
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
}
module.exports = DescriptionContext
