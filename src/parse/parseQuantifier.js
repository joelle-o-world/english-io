function parseQuantifier(str, dictionary) {
  let result
  if(/^the/.test(str))
    return {
      article: 'the',
      definite:true,
      remainder: str.slice(4),
      min: 1,
      max: Infinity,
    }
    else if(result = /^a|an/.exec(str))
      return {
        article: result[0],
        definite: false,
        remainder: str.slice(result[0].length+1),
        min: 1,
        max: 1,
      }
    else if(result = /^another/.test(str))
      return {
        article: result[0],
        definite: false,
        remainder: str.slice(result[0].length+1),
        min: 1,
        max: 1,
      }
  else if(result = /^[0-9]+/.exec(str)) {
    let n = parseInt(result)
    return {
      article: result[0],
      definite: false,
      remainder: str.slice(result[0].length+1),
      min: n,
      max: n,
    }
  }
}
module.exports = parseQuantifier
