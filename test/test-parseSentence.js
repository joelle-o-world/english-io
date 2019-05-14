const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const parse = require('../src/parse')

let ctx = new DescriptionContext

let [cat1] = D.quickDeclare('a cat')


let parsed = parse.imperative('chase the dog', cat1, D, ctx)
console.log(parsed)
