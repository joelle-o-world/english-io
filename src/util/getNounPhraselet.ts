import * as regops from 'regops'

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

const nounPhraseRegex = regops.whole(regops.concatSpaced(
  regops.optionalConcatSpaced(articleRegex, ordinalRegex),
  /(?<phraselet>.+)/
))


function getNounPhraselet(str:string) {
  let result = nounPhraseRegex.exec(str)
  if(result)
    return result.groups
  else if(/^[A-Z]/)
    return {
      properNoun: str
    }
}
export {getNounPhraselet}