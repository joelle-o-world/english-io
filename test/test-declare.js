const declare = require('../src/declare')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const ctx = new DescriptionContext

let {domain} = D.declare(ctx,
  'a dog fears a cat',
)



let cat = domain[1]

cat.do('chase another dog')

for(let e of domain) {
  console.log(e.str()+':')
  for(let fact of e.facts)
    console.log('\t-', fact.str())
}
