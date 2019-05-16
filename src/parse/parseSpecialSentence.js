const parseSimpleSentence = require('./parseSentence')

function parseSpecialSentence(str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.specialSentenceSyntaxs)
    if(result = syntax.parseSentence(str, ctx))
      return result

  // Otherwise
  return parseSimpleSentence(str, dictionary, ctx)
}
module.exports = parseSpecialSentence

function parseSpecialImperative(subject, str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.specialSentenceSyntaxs)
    if(result = syntax.parseSentence(str, ctx, subject))
      return result

  // Otherwise
  return parseSimpleSentence.imperative(subject, str, dictionary, ctx)
}
module.exports.imperative = parseSpecialImperative
