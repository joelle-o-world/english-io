const Dictionary = require("../src/Dictionary")
const Noun = require('../src/Noun')


let D = new Dictionary({
  nouns: ['hog', 'log'],
  adjectives: {smelly: () => null,},
  predicates: [
    {verb: 'sniff', params:['subject', 'object']},
    {forms:[
      {verb:'eat', params:['subject', 'object']},
      {verb:'consume', params:['subject', 'object']}
    ]}
  ]
})
D.addNouns('dog', 'cat', {noun:'greyhound', inherits:'dog'})

let a = D.createEntity()
a.be_a('greyhound')
console.log(a.str())

console.log(D.predicates.byName)

let dog1 = D.createEntity().be_a('dog')
let log1 = D.createEntity().be_a('log')

let sentence1 = D.S('sniff', dog1, log1)
console.log(sentence1.str())
