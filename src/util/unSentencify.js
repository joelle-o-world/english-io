function getSentences(str, decapitalise=true) {
  let lines = str.split('\n')

  let sentences = []

  for(let line of lines) {
    sentences.push(
      ...line.split(/\.(?:\s+|$)/ig).filter(s => s.length)
    )
  }

  sentences = sentences
    .filter(s => s.length)
  if(decapitalise)
    sentences = sentences.map(s => s[0].toLowerCase() + s.slice(1))

  return sentences
}
module.exports = getSentences
