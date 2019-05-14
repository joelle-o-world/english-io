const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const parse = require('../src/parse')

let ctx = new DescriptionContext

let domain = D.quickDeclare(
  'a cat',
  '2 dogs',
  'a cat',
)

let s1 = parse('the cat chases the cat', D, ctx).findOrSpawn(domain)

let parsed = parse('a dog chases an animal', D, ctx)
console.log(parsed.matches(s1))
