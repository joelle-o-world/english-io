const ordinal = require('integer-to-ordinal-english')
const regops = require('./regOps')


const articleRegex = regops.capture(
  /a|an|another|the/,
  'article'
)
const ordinalRegex = regops.capture(
  regops.or(
    /[0-9]+(?:st|nd|rd|th)/,
    /(?:\w+-)*(?:first|second|third|(?:\w+th))/),
  'ordinal'
)

const nounPhraseRegex = regeops.whole(regops.concat(
  regops.optionalConcatSpaced(articleRegex, ordinalRegex),
  /(?<phraselet>.+)/
))


function getNounPhraselet(str) {
  let result = nounPhraseRegex.exec(str)
  if(result)
    return result.groups
  else if(/^[A-Z]/)
    return {
      properNoun: str
    }
}
module.exports = getNounPhraselet
