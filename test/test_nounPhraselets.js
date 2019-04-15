const d = require('../exampleDictionary')

let stuff = d.quickDeclare(
  'a cat meows',
)

let cat = stuff[0]
cat.adjectives.push('hairy')
console.log('cat:', cat.str(), cat.reg())

console.log(
  cat.nounPhraseletRegex(2)
)
