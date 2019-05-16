function parse(str, dictionary, ctx) {
  let result


  return parseSpecialSentence(str, dictionary, ctx)
    || parseSpecialSentence.imperative(undefined, str, dictionary, ctx)
    || parseNounPhrase(str, dictionary, ctx)
}

module.exports = parse

const parseSentence = require('./parseSentence')
const parseNounPhrase = require('./parseNounPhrase')
const parseOrdinal = require('./parseOrdinal')
const parsePossessive = require('./parsePossessive')
const parseQuantifier = require('./parseQuantifier')
const parseSpecialSentence = require('./parseSpecialSentence')

Object.assign(module.exports, {
  sentence: parseSpecialSentence,
  imperative: parseSpecialSentence.imperative,
  simpleSentence: parseSentence,
  simpleImperative: parseSentence.imperative,
  nounPhrase: parseNounPhrase,
  ordinal: parseOrdinal,
  possessive: parsePossessive,
  quantifier: parseQuantifier,
})
