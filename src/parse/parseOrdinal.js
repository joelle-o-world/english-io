const ordinal = require('integer-to-ordinal-english')

const LIMIT = 10

function parseOrdinal(str) {
  if(/^[0-9]+(?:th|st|nd|rd)(?= |$)/.test(str)){
    let n = parseInt(str)
    if(!isNaN(n))
      return n
  }

  str = str.toLowerCase()

  for(let i=1; i<LIMIT; i++) {
    if(ordinal(i).toLowerCase() == str)
      return i
  }

  // Otherwise,
  return null
}
module.exports = parseOrdinal
