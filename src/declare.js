const parse = require('./parse')
const DescriptionContext = require('./DescriptionContext')
const {explore} = require('./search')
const uniqueCombine = require('./util/uniqueCombine')

function declare(dictionary, ctx=new DescriptionContext, ...strings) {
  let domain = []
  for(let str of strings) {
    let parsed = parse(str, dictionary, ctx)

    if(parsed.isNounPhrase) {
      let out = parsed.spawn(domain, dictionary, ctx)
      domain = [...uniqueCombine(domain, explore(out))]
    } else if(parsed.isParsedSentence) {
      let sentence = parsed.create(domain, dictionary, ctx)
      sentence.start()
      domain = explore([...domain, ...sentence.entityArgs])
      domain = [...uniqueCombine(domain, explore(sentence.entityArgs))]
    }
  }

  return {
    domain: domain,
    ctx: ctx
  }
}
module.exports = declare
