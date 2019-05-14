const declare = require('../src/declare')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const ctx = new DescriptionContext

let {domain} = D.declare(ctx,
  'a cat that chases a dog',
  'the dog woofs',
  '2 pairs of trousers',
)

for(let e of domain) {
  console.log(e.str()+':')
  for(let fact of e.facts)
    console.log('\t-', fact.str())
}
console.log(ctx)
