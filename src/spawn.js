const articleReg = /the|a|an|another/
const regOps = require('./util/regOps.js')
const getNounPhraselet = require('./util/getNounPhraselet')

const Entity = require('./Entity')

function spawn(dictionary, str, domain) {
  // spawn a new entity from a noun phrase string

  let phraselet = getNounPhraselet(str)

  // first check all nouns in vanilla form
  for(let noun in dictionary.nouns) {
    let formattedNoun = noun.replace(/_/g, ' ')
    //let reg = new RegExp('^(?:'+articleReg.source + ' ' + noun+')$')
    let reg = regOps.whole(regOps.concatSpaced(articleReg, formattedNoun))
    if(reg.test(str))
      return new Entity(dictionary).be_a(noun)
  }

  // then check the special entity spawners
  for(let spawner of dictionary.entitySpawners) {
    let parsed = spawner.parse(str, domain)
    if(parsed) {
      let e = spawner.construct(...parsed.args)
      if(e)
        return e
    }
  }


}
module.exports = spawn

function randomSpawn(dictionary) {
  let nounKeys = Object.keys(dictionary.nouns)
  let noun = nounKeys[Math.floor(Math.random()*nounKeys.length)]
  return new Entity(dictionary).be_a(noun)
}
module.exports.random = randomSpawn
