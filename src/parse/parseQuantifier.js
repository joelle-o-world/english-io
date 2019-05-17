function parseQuantifier(str, dictionary) {
  let result
  if(/^the(?= |$)/i.test(str))
    return {
      article: 'the',
      definite:true,
      remainder: str.slice(4),
      min: 1,
      max: Infinity,
    }
      else if(result = /^another( |$)/i.exec(str))
        return {
          article: result[0],
          definite: false,
          remainder: str.slice(result[0].length+1),
          min: 1,
          max: 1,
        }
      else if(result = /^(a|an)( |$)/i.exec(str))
        return {
          article: result[0],
          definite: false,
          remainder: str.slice(result[0].length+1),
          min: 1,
          max: 1,
        }
      else if(result = /^[0-9]+( |$)/i.exec(str)) {
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
