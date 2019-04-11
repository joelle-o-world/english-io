// Quick way to declare a world.

const Declarer = require('./Declarer')

function quickDeclare(dictionary, ...strings) {
  let dec = new Declarer(dictionary)
  //dec.predicates.addPredicates(...dictionary.predicates.predicates)

  dec.declare(...strings)

  return dec.entities
}
module.exports = quickDeclare
