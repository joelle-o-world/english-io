const ordinal = require('integer-to-ordinal-english')

const LIMIT = 100

/** Parse an english ordinal number string (words) by brute force. */
function parseOrdinal(str:string) {
  let n = parseInt(str)
  if(!isNaN(n))
    return n

  str = str.toLowerCase()

  for(let i=1; i<LIMIT; i++) {
    if(ordinal(i).toLowerCase() == str)
      return i
  }
}
export {parseOrdinal}
