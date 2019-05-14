const parseSentence = require('./parseSentence')
const parseNounPhrase = require('./parseNounPhrase')
const parseOrdinal = require('./parseOrdinal')
const parsePossessive = require('./parsePossessive')
const parseQuantifier = require('./parseQuantifier')

function parse(str, dictionary, ctx) {
  let result

  return parseSentence(str, dictionary, ctx)
    || parseSentence.imperative(str, undefined, dictionary, ctx)
    || parseNounPhrase(str, dictionary, ctx)
}

module.exports = parse

Object.assign(module.exports, {
  sentence: parseSentence,
  imperative: parseSentence.imperative,
  nounPhrase: parseNounPhrase,
  ordinal: parseOrdinal,
  possessive: parsePossessive,
  quantifier: parseQuantifier,
})
