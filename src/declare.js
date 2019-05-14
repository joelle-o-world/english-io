const parse = require('./parse')
const DescriptionContext = require('./DescriptionContext')

function declare(dictionary, ctx=new DescriptionContext, ...strings) {
  let domain = []
  for(let str of strings) {
    let parsed = parse(str, dictionary, ctx)

    if(parsed.isNounPhrase) {
      let out = parsed.spawn(domain, dictionary, ctx)
      domain.push(...out)
    } else if(parsed.isParsedSentence) {
      let sentence = parsed.findOrSpawn(domain, dictionary, ctx)
      sentence.start()
      domain.push(...sentence.entityArgs)
    }
  }
  return {
    domain: domain,
    ctx: ctx
  }
}
module.exports = declare
