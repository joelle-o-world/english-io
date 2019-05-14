const {toSingular} = require('../util/plural')

const properNounRegex = /^([A-Z][a-zA-Z]+)( [A-Z][a-zA-Z]+)*$/
const pronounRegex = /^(?:me|you|her|him|it|us|them)$/i
const articleRegex = /^(the|a|an)$/

const NounPhrase = require('./NounPhrase')
const RegularNounPhrase = require('./RegularNounPhrase')
const PronounNounPhrase = require('./PronounNounPhrase')
const ProperNounNounPhrase = require('./ProperNounNounPhrase')
const parseNoun = require('./parseNoun')
const parseQuantifier = require('./parseQuantifier')
const parseOrdinal = require('./parseOrdinal')
const DescriptionContext = require('../DescriptionContext')


function parseNounPhrase(dictionary, str, ctx=new DescriptionContext) {
  // Is it a proper noun?
  let proper = properNounRegex.exec(str)
  if(proper)
    return new ProperNounNounPhrase({properNoun: str, str:str}, dictionary, ctx)

  // Is it a pronoun?
  let pronoun = pronounRegex.exec(str)
  if(pronoun)
    return new PronounNounPhrase({pronoun:str, str:str}, dictionary, ctx)

  // Parse as a regular noun-phrase.
  let info = parseNoun(dictionary, str)

  if(!info)
    return null

  let {noun, remainder, plural} = info
  let owner = null
  let article = null
  let range = plural ? {min:1, max:Infinity} : {min:1, max:1}
  let ordinal
  let definite

  // Look for a possessive adjective or a quantifier.
  let result = parsePossessive(dictionary, remainder)
  if(result) {
    remainder = result.remainder.trim()
    owner = result.owner
  } else if(result = parseQuantifier(dictionary, remainder)) {
    remainder = result.remainder.trim()
    article = result.article
    definite = result.definite
    if(result.min && result.max)
      range = rangeOverlap(range, result)
  }

  // Treat the remaining words as adjectives
  let words = remainder.split(' ').filter(adj => adj.length)
  if(words[0] && (ordinal = parseOrdinal(words[0])))
    words.shift()

  let adjectives = words

  if(range.min > range.max || (!definite && ordinal))
    throw 'Illogical noun phrase: '+str

  return new RegularNounPhrase({
    str: str,
    owner: owner,
    article: article,
    definite: definite,
    ordinal: ordinal,
    adjectives: adjectives,
    noun: noun,
    min: range.min,
    max: range.max,
  }, dictionary, ctx)
}
module.exports = parseNounPhrase

const parsePossessive = require('./parsePossessive')

function rangeOverlap(range1, range2) {
  return {
    min: Math.max(range1.min, range2.min),
    max: Math.min(range1.max, range2.max)
  }
}
