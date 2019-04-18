const d = require('../exampleDictionary')

let [cat, dog] = d.quickDeclare(
  'a cat speaks',
  'a dog speaks',
)

console.log(
  cat.facts.map(fact => fact.str()),
  dog.facts.map(fact => fact.str())
)
