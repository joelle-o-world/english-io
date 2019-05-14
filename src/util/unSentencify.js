function getSentences(str) {
  let lines = str.split('\n')

  let sentences = []

  for(let line of lines) {
    sentences.push(
      ...line.split(/\.(?:\s+|$)/ig).filter(s => s.length)
    )
  }

  sentences = sentences.map(s => s[0].toLowerCase() + s.slice(1))
    .filter(s => s.length)

  return sentences
}
module.exports = getSentences
