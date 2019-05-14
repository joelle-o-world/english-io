const ParsedSentence = require('./ParsedSentence')

function parseSimpleSentence(str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.predicates.syntaxs) {
    if(result = syntax.parseSentence(str, ctx))
      return result
  }
}
module.exports = parseSimpleSentence

function parseImperative(str, subject, dictionary, ctx) {
  let result
  for(let syntax of dictionary.predicates.syntaxs) {
    if(
      syntax.predicate.actionable
      && (result = syntax.parseImperativeSentence(str, subject, ctx))
    )
      return result
  }
}
module.exports.imperative = parseImperative
