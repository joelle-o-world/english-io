/**
 * Parse a quantifier word/phrase as a range of possible meanings
 * @method parseQuantifier
 * @param {String} str The quantifier
 * @return {Object} {min, max}
 */
function parseQuantifier(str) {
  let r // result, a temporary variable, reused many times

  // a few
  r = getWord(/a few|some/, str)
  if(r)
    return {min: 2, max:5, definite:false, str:r[0]}

  // indefinite article
  r = getWord(/a|an/, str)
  if(r)
    return {min:1, max:1, definite:false, str:r[0]}

  // definite article
  if(getWord(/the/, str))
    return {min:1, max:Infinity, definite:true, str:'the'}

  // number
  r = getWord(/\d+/, str)
  if(r) {
    let n = parseInt(r[0])
    if(!isNaN(n))
      return {min: n, max:n, str:r[0]}
  }

  // approximate number
  r = getWord(/(?:approximately|around|about) (?<n>\d+)/, str)
  if(r) {
    let n = parseInt(r[1])
    if(!isNaN(n))
      return {
        min: Math.floor(0.75 * n),
        max: Math.ceil(n / 0.75),
        str: r[0]
      }
  }

  return null
}
module.exports = parseQuantifier

function getWord(wordReg, str) {
  if(wordReg instanceof RegExp)
    wordReg = wordReg.source
  let reg = new RegExp('^(?:'+wordReg+')(?= |$)')
  let result = reg.exec(str)
  if(result) {
    return result
  } else
    return null
}
