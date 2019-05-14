function *uniqueCombine(...iterators) {
  let yielded = []
  for(let iterator of iterators)
    for(let val of iterator)
      if(!yielded.includes(val)) {
        yielded.push(val)
        yield val
      }
}
module.exports = uniqueCombine
