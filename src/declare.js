const parse = require('./parse')
const DescriptionContext = require('./DescriptionContext')
const {explore} = require('./search')
const uniqueCombine = require('./util/uniqueCombine')

function declare(dictionary, ctx=new DescriptionContext, ...strings) {
  let domain = []
  for(let str of strings) {
    let parsed = parse(str, dictionary, ctx)

    if(!parsed) {
      console.log('unable to parse:', str)
      break
    }

    if(parsed.isNounPhrase) {
      let out = parsed.spawn(domain, dictionary, ctx)
      domain = [...uniqueCombine(domain, explore(out))]
    } else if(parsed.isParsedSentence) {
      let sentence = parsed.start(domain, dictionary, ctx)
      if(sentence && sentence.truthValue == 'true') {
        domain = explore([...domain, ...sentence.entityArgs])
        domain = [...uniqueCombine(domain, explore(sentence.entityArgs))]
      } else
        console.warn('problem declaring:', str)
    } else if(parsed.isSpecialSentence) {
      parsed.start()
    } else
      console.warn('Unhandled declaration:', str, '\ntype:',parsed.constructor.name)
  }

  return {
    domain: domain,
    ctx: ctx
  }
}
module.exports = declare

function declareSingle(dictionary, ctx, domain, str) {
  let parsed = parse(str, dictionary, ctx)

  if(!parsed)
    throw 'unable to parse: ' + str

  if(parsed.isNounPhrase) {
    let out = parsed.spawn(domain, dictionary, ctx)
    domain = [...uniqueCombine(domain, explore(out))]
  } else if(parsed.isParsedSentence) {
    let sentence = parsed.start(domain, dictionary, ctx)
    if(sentence && sentence.truthValue == 'true') {
      domain = explore([...domain, ...sentence.entityArgs])
      domain = [...uniqueCombine(domain, explore(sentence.entityArgs))]
    } else
      throw 'problem declaring:' + str
  } else if(parsed.isSpecialSentence) {
    parsed.start()
  } else
    throw 'Unhandled declaration:'+ str + '\ntype: ' + parsed.constructor.name

  return {
    domain: domain,
    ctx: ctx,
  }
}
module.exports.single = declareSingle
