const SpecialSyntax = require('../src/SpecialSyntax')
const D = require('../exampleDictionary')
const parseSpecialSentence = require('../src/parse/parseSpecialSentence')

let ss1 = new SpecialSyntax('every #_ seconds, ~_')
ss1.dictionary = D

let dog = D.createEntity()
dog.be_a('dog')

let parsed = parseSpecialSentence('after 5 seconds, the dog woofs', D, undefined)
console.log(parsed)
