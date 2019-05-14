const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')

let ctx = new DescriptionContext

let domain = D.quickDeclare(
  'a cat chases a dog',
  'another cat'
)

console.log(domain[0].str(ctx))

let np = parseNounPhrase(D, "it", ctx)
console.log(np)

console.log('searching', domain.map(e=>e.str()))
let results = [...np.find(domain)]
if(results.length)
  console.log('results:', results.map(e=>e.str()))
else
  console.log('no matches found :(')
