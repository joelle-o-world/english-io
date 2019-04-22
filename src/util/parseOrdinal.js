const ordinal = require('integer-to-ordinal-english')

const LIMIT = 100

function parseOrdinal(str) {
  let n = parseInt(str)
  if(!isNaN(n))
    return n

  str = str.toLowerCase()

  for(let i=1; i<LIMIT; i++) {
    if(ordinal(i).toLowerCase() == str)
      return i
  }
}
module.exports = parseOrdinal
