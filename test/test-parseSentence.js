const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const parse = require('../src/parse')

let ctx = new DescriptionContext

let domain = D.quickDeclare(
  'a cat',
  '2 dogs',
  'a cat',
)

let np = parse.nounPhrase('my cat\'s pair of trousers', D, ctx)
console.log(np.findOrSpawn(domain))
