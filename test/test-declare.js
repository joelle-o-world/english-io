const declare = require('../src/declare')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const ctx = new DescriptionContext

let {domain} = D.declare(ctx,
  '3 dogs',
  'the 2nd dog woofs'
)

let cat = domain[1]

for(let e of domain) {
  console.log(e.str()+':')
  for(let fact of e.facts)
    console.log('\t-', fact.str())
}
