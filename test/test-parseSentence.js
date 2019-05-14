const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')

let ctx = new DescriptionContext

let domain = D.quickDeclare(
  'a cat chases a dog',
  'another cat'
)

console.log(domain[0].str(ctx))
