

const RandExp = require('randexp')

const bruteForceLimit = 100
/** find a string which matches one regex but not a second */
function differentiate(match:RegExp|string, ...dontMatch:RegExp[]) {
  let gen = new RandExp(match)

  for(let i=0; i<bruteForceLimit; i++) {
    let str = gen.gen()

    if(dontMatch.every(reg => !reg.test(str)))
      return str
  }

  return null
}
module.exports = differentiate
