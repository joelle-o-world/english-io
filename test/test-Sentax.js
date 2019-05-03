const d = require('../exampleDictionary')
const SubjectContractedSentax = require('../src/SubjectContractedSentax')
const Sentax = require('../src/Sentax')

let a = d.quickDeclare(
  'pat the dog'
)[0]

let fact = a.facts[0]

console.log(fact.str())

let sentaxs = [
  ...fact.sentaxs(),
  new Sentax({verb:'pet', args:{_subject:'you', _object:'the cat'}}),
  new Sentax({
    verb: 'eat',
    args:{_subject:'the dog', _object:'a bone'}
  }),
  new Sentax({
    verb: 'eat',
    args:{_subject:'the dog', _object:'some spaghetti'}
  }),
  new Sentax({
    verb: 'chase',
    args:{_subject:'the dog', _object:'the cat'}
  })
]

console.log('sentaxs:', sentaxs.map(sentax => sentax.str()))

let contracted = [...Sentax.contract(...sentaxs)]

console.log(contracted)
let n = 1
for(let sentax of contracted)
  console.log(n++ + '.', sentax.str())
