const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')

let domain = D.quickDeclare(
  'a cat chases a dog',
  'another cat'
)

let np = parseNounPhrase(D, "the 2nd animal")

console.log('searching', domain.map(e=>e.str()))
if(np)
  for(let e of np.find(domain)) {
    console.log('e:', e.str())
  }
