const Dictionary = require("../src/Dictionary")
const Noun = require('../src/Noun')


let D = new Dictionary
D.addNoun('dog')

let a = D.createEntity()
a.be_a('dog')
console.log(a)
console.log(a.str())
