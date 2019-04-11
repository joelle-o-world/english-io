const EventEmitter = require('events')
const Sentence = require('./Sentence')

/**
  The FactListener class is a convenient class for handling event listeners on
  multiple Entitys at once.
  @class FactListener
  @constructor
  @extends EventEmitter
  @param {Entity} [...entities]
    A list of member entities to add to the new fact listener.
*/

class FactListener extends EventEmitter {
  constructor(...entities) {
    // call superconstructor
    super()

    // list of member entities
    this.entities = []

    // last emitted fact (used to avoid duplicates)
    this.lastFact = null

    // function to be called by entity event listeners
    this.callback = sentence => {
      // if fact is not a duplicate, emit a fact event
      if(!this.lastFact || !Sentence.compare(this.lastFact, sentence))
        this.emit('fact', sentence)

      this.lastFact = sentence
    }

    // add constructor arguments to member list
    for(let entity of entities)
      this.add(entity)
  }

  /**
   * Adds a single entity member.
   * @method add
   * @param {Entity} entity The entity to be added.
   * @return {null}
   */
  add(entity) {
    // throw an error if argument is not a entity
    if(!entity.isEntity)
      throw 'FactListener add() expects a entity'
    this.entities.push(entity)
    entity.on('fact', this.callback)

  }

  /**
    * Removes a single entity member.
    * @method remove
    * @param {Entity} entity The entity to be added.
    * @return {null}
    */
  remove(entity) {
    if(this.entities.includes(entity)) {
      // remove event listener
      entity.removeListener('fact', this.callback)

      // remove entity from member list.
      let i = this.entities.indexOf(entity)
      this.entities.splice(i, 1)
    } else
      console.warn('attempt to remove entity from fact listener to which it is not a member')
  }

  /**
    * Remove all entities members
    * @method clear
    * @return {null}
    */
  clear() {
    for(let entity of this.entities)
      this.remove(entity)
  }
}
module.exports = FactListener


// PROBLEMS:
// - Eliminating duplicates.
