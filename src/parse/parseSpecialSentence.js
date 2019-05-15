function parseSpecialSentence(str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.specialSentenceSyntaxs)
    if(result = syntax.parseSentence(str, ctx))
      return result

  // Otherwise
  
}
module.exports = parseSpecialSentence

function parseSpecialImperative(subject, str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.specialSentenceSyntaxs)
    if(result = syntax.parseSentence(str, ctx, subject))
      return result
}
module.exports.imperative = parseSpecialImperative
