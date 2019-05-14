// look for a possessive in a pre-noun string.

const regex = /(.*)((?:'s)|(?:(?<=s)'))/g

const pronounMap = { // possessive => object-form
  my: 'me',
  your: 'you',
  his: 'him',
  her: 'her',
  our: 'us',
  its: 'it',
  their: 'them',
}

function parsePossessive(dictionary, str) {
  // Is it an apostrophe -S ('s) type.
  let result = regex.exec(str)
  if(result) {
    let owner = result[1]
    let remainder = str.slice(result[0].length).trim()

    return {
      owner: parseNounPhrase(dictionary, owner),
      remainder: remainder
    }
  }

  // Otherwise, find a possessive pronoun
  let words = str.split(' ')
  let firstWord = words[0]
  if(pronounMap[firstWord])
    return {
      owner: parseNounPhrase(dictionary, pronounMap[firstWord]),
      remainder: words.slice(1).join(' ')
    }

  // Otherwise,
  return null
}
module.exports = parsePossessive

const parseNounPhrase = require('./parseNounPhrase')
