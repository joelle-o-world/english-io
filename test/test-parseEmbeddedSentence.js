const parseNounPhrase = require('../src/parse/parseNounPhrase')
const D = require('../exampleDictionary')
const DescriptionContext = require('../src/DescriptionContext')
const parse = require('../src/parse')
const parseEmbeddedSentence = require('../src/parse/parseEmbeddedSentence')
const ctx = new DescriptionContext

let domain = D.quickDeclare(
  'a cat chases a dog',
)

let parsed = parseEmbeddedSentence(
  'the cat that chases the dog', D, ctx)

console.log(parsed.spawn(domain))
