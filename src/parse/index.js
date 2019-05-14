const parseSentence = require('./parseSentence')

Object.assign(module.exports, {
  sentence: parseSentence,
  imperative: parseSentence.imperative,
  nounPhrase: require('./parseNounPhrase'),
  ordinal: require('./parseOrdinal'),
  possessive: require('./parsePossessive'),
  quantifier: require('./parseQuantifier'),
})
