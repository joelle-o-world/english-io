const d = require('../exampleDictionary')
const nounPhraseletStr = require('../src/Entity_nounPhraseletStr')
const DescriptionContext = require('../src/DescriptionContext')

let stuff = d.quickDeclare(
  'a cat meows',
)

let cat = stuff[0]
cat.adjectives.push('hairy')
/*console.log('cat:', cat.str(), cat.reg())

console.log(
  cat.nounPhraseletRegex(2)
)*/

let ctx = new DescriptionContext

console.log(cat.str(ctx, 2))
