const Dictionary = require("../src/Dictionary")
const Noun = require('../src/Noun')


let D = new Dictionary({
  nouns: ['hog', 'log'],
  adjectives: {smelly: () => null,}
})
D.addNouns('dog', 'cat', {noun:'greyhound', inherits:'dog'})

let a = D.createEntity()
a.be_a('greyhound')
console.log(a)
console.log(a.str())
