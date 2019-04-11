const parseText = require("./parseText")

function spellcheck(str) {
  let split = parseText(str)

  // correct the spelling of indefinite articles
  for(var i=1; i<split.length; i++)
    if((/^(a|an)$/).test(split[i-1])) {
      if((/^[aeiouh].*/).test(split[i]))
        split[i-1] = 'an'
      else
        split[i-1] = 'a'
    }

  let recombined = parseText.recombine(split)
  return recombined+' '
}
module.exports = spellcheck

function sentencify(str) {
  let split = parseText(str)

  // auto capitalise first letter of first word
  if(split[0] != '^')
    split.unshift('^')
  // add full-stop if does not exist
  if(!(/[.!?]/).test(split[split.length-1]))
    split.push('.')

  // check and correct spelling of indefinite articles
  for(var i=1; i<split.length; i++)
    if((/^(a|an)$/).test(split[i-1])) {
      if((/^[aeiouh].*/).test(split[i]))
        split[i-1] = 'an'
      else
        split[i-1] = 'a'
    }

  let recombined = parseText.recombine(split)
  return recombined+' '
}
module.exports.sentencify = sentencify
