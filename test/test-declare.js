const declare = require('../src/declare')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const ctx = new DescriptionContext
const FactListener = require('../src/FactListener')

let {domain} = D.declare(ctx,
  '3 dogs',
  //'after 3 seconds, every 1 seconds, the first dog woofs',
)

let dog = domain[1]
dog.do('every 0.1 seconds, woof')

for(let e of domain) {
  console.log(e.str()+':')
  for(let fact of e.facts)
    console.log('\t-', fact.str())
}

let listener = new FactListener(...domain).on('fact', fact=> console.log(fact.str()))
