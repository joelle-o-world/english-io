/**
  * A class for generating descriptions by following relationships between
  * objects.
  * @class WanderingDescriber
  * @constructor
  * @param {Sentence|Entity} ...toLog
  */
class WanderingDescriber {
  constructor(...toLog) {
    this.history = []
    this.recentlyMentionedEntitys = []
    this.maxLookback = 5
    this.includeHistory = false

    this.log(...toLog)
  }

  /**
   * @method log
   * @param {Sentence|Entity} ...args
   */
  log(...args) {
    for(let arg of args) {
      if(arg.isSentence) {
        // handle Sentence
        let sentence = arg
        this.history.push(sentence)
        this.recentlyMentionedEntitys.push(...sentence.entityArgs)
        while(this.recentlyMentionedEntitys.length > this.maxLookback)
          this.recentlyMentionedEntitys.shift()
      } else if(arg.isEntity) {
        // handle Entity
        let entity = arg
        this.recentlyMentionedEntitys.push(entity)
        while(this.recentlyMentionedEntitys.length > this.maxLookback)
          this.recentlyMentionedEntitys.shift()
      }
    }
  }

  /**
   * @method next
   * @return {Sentence|null}
   */
  next() {
    let facts = this.allFactsShuffled()
    for(let fact of facts) {
      if(!fact.predicate.banal && !this.history.includes(fact)) {
        this.log(fact)
        return fact
      }
    }

    return null
  }

  /**
   * @method nextFew
   * @param {Number} howMany
   * @return {Array}
   */
  nextFew(howMany) {
    let list = []
    let facts = this.allFactsShuffled()
    for(let fact of facts) {
      if(!fact.predicate.banal && !this.history.includes(fact)) {
        this.log(fact)
        list.push(fact)
        if(list.length >= howMany)
          break
      }
    }

    return list
  }

  /**
   * @method allFactsShuffled
   * @return {Array}
   */
  allFactsShuffled() {
    let list = []
    for(let entity of this.recentlyMentionedEntitys) {
      list.push(...entity.facts)
      if(this.includeHistory)
        list.push(...entity.history)
    }
    return list.sort(() => Math.random()*2-1)
  }
}
module.exports = WanderingDescriber
