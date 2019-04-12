const articleReg = /the|a|an|another/
const regOps = require('./util/regOps.js')

const Entity = require('./Entity')

function spawn(dictionary, str) {
  // spawn a new entity from a noun phrase string
  for(let {noun} of dictionary.nouns) {
    let formattedNoun = noun.replace(/_/g, ' ')
    //let reg = new RegExp('^(?:'+articleReg.source + ' ' + noun+')$')
    let reg = regOps.whole(regOps.concatSpaced(articleReg, formattedNoun))
    if(reg.test(str))
      return new Entity(dictionary).be_a(noun)
  }
}
module.exports = spawn

function randomSpawn(dictionary) {
  let nounKeys = Object.keys(dictionary.nouns)
  let noun = nounKeys[Math.floor(Math.random()*nounKeys.length)]
  return new Entity(dictionary).be_a(noun)
}
module.exports.random = randomSpawn
