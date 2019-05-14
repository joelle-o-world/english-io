function parseEmbeddedSentence(str, dictionary, ctx) {
  let result
  for(let syntax of dictionary.predicates.syntaxs) {
    if(result = syntax.parseEmbeddedSentence(str, ctx))
      return result
  }
}
module.exports = parseEmbeddedSentence
