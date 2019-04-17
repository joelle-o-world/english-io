const spellcheck = require('../src/util/spellcheck')

let str = "I have a apple"
console.log('spellcheck(', str, ')')

let out = spellcheck(str)
console.log('returns:', out)
