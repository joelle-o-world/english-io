const {toSingular} = require('../util/plural')

function parseNoun(dictionary, str) {
  // check phrasal nouns
  for(let noun of dictionary.phrasalNouns) {
    let info = noun.parse(str)
    if(info)
      return info
  }

  // check last word against nouns
  let lastWord = str.slice((str.lastIndexOf(' ') + 1))
  let lastWord2 = toSingular(lastWord)
  if(dictionary.nouns[lastWord] || dictionary.nouns[lastWord2]) {
    let noun = dictionary.nouns[lastWord] || dictionary.nouns[lastWord2]
    let info = noun.parse(str)
    return info
  }
}
module.exports = parseNoun
