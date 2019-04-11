const Plur = require('./plural')
const parseQuantifier = require('./parseQuantifier')

/**
 * Parse a noun-phrase without embedded sentence clauses. Noun-phrases must be
 * in the form: [quantifier] + [...adjectives] + [noun].
 * @method
 */
function parseNounPhrase(str, dictionary) {
  let noun = null
  let plural = undefined

  // check phrasal nouns
  let remainder
  for(let singularNoun of dictionary.phrasalNouns) {
    if(new RegExp(singularNoun+'$', 'i').test(str)) {
      noun = singularNoun
      plural = false
      remainder = str.slice(0, -singularNoun.length).trim()
      break;
    }


    let pluralNoun = Plur.toPlural(singularNoun)
    if(new RegExp(pluralNoun+'$', 'i').test(str)) {
      noun = singularNoun
      plural = true
      remainder = str.slice(0, -pluralNoun.length).trim()
      break;
    }
  }

  // Unless phrasal noun was successful, check the last word against regular
  // nouns.
  if(remainder == undefined) {
    // parse last word as singular
    let lastWord = str.slice((str.lastIndexOf(' ') + 1))
    if(dictionary.nouns[lastWord]) {
      noun = lastWord
      plural = false
      remainder = str.slice(0, -lastWord.length).trim()
    } else{
      // parse last word as a plural
      let lastWordSingular = Plur.toSingular(lastWord)
      if(lastWordSingular && dictionary.nouns[lastWordSingular]) {
        noun = lastWordSingular
        plural = true
        remainder = str.slice(0, -lastWord.length).trim()
      }
    }
  }

  // exit early if failed to identify a noun
  if(!noun)
    return null

  // parse quantifier/quantity
  let quantity = plural ? {min:2, max:Infinity} : {min:1, max:1}
  let quantifier = parseQuantifier(remainder)
  if(quantifier) {
    quantity = rangeOverlap(quantity, quantifier)
    remainder = remainder.slice(quantifier.str.length).trim()
  } else {
    console.warn('expected quantifier')
    return null
  }

  if(quantity.min > quantity.max)
    return null

  // treat the remaining words as adjectives
  let adjectives = remainder.split(' ').filter(adj => adj.length)

  return {
    noun: noun,
    plural: plural,
    quantityRange: quantity,
    adjectives: adjectives,
  }
}
module.exports = parseNounPhrase

/**
 * Calculate a new range which is the intersection of two given ranges.
 * @method rangeOverlap
 * @param range1
 * @param range1.min
 * @param range1.max
 * @param range2.min
 * @param range2.max
 * @return {Object} A new range {Min, Max}
 */
function rangeOverlap(range1, range2) {
  return {
    min: Math.max(range1.min, range2.min),
    max: Math.min(range1.max, range2.max)
  }
}
