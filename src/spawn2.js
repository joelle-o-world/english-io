/** A more flexible version of spawn, allowing quanitifiers and adjectives */

// REQUIRES AT BOTTOM!


/**
 * Create new entitys from noun-phrase-strings.
 * @method spawn
 * @param {Dictionary} dictionary
 * @param {String} [...strs] Noun strings
 * @return {Array} An array of entitys
 * @throws If unable to parse one of the arguments.
 */
function spawn(dictionary, ...strs) {
  let list = []
  for(let str of strs) {
    let parsed = parseNounPhrase(str, dictionary)
    if(!parsed)
      throw "Unable to spawn: " + str

    let {noun, adjectives, quantityRange} = parsed

    let n = randomInRange(quantityRange)

    for(let i=0; i<n; i++) {
      let entity = new Entity(dictionary)
      entity.be_a(noun)
      for(let adj of adjectives)
        entity.be(adj)

      list.push(entity)
    }
  }

  return list
}
module.exports = spawn


function randomInRange({min, max}) {
  if(max == Infinity) {
    max = min
    while(Math.random() < 0.75)
      max++
  }

  return min + Math.floor(Math.random() * (max-min+1))
}

const parseNounPhrase = require('./util/parseNounPhrase')
const Entity = require('./Entity')
