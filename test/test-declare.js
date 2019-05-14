const declare = require('../src/declare')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const ctx = new DescriptionContext

let {domain} = declare(D, ctx,
  'a cat chases a dog',
  '2 pairs of trousers',
)
console.log(domain.map(e=>e.str()))
