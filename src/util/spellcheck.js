const parseText = require("./parseText")

function spellcheck(str) {
  // correct the indefinite articles
  let reg = /(?<=^| )a?(?= [aeiou])/ig
  let reg2 = /(?<=^| )(?:an)?(?= [^aeiou])/ig
  return str.replace(reg, 'an').replace(reg2, 'a')
}
module.exports = spellcheck

function sentencify(str) {
  // check and correct spelling of indefinite articles
  str = spellcheck(str)

  // auto capitalise first letter of first word
  if(!/^[A-Z]/.test(str))
    str = str[0].toUpperCase() + str.slice(1)

  // add full-stop if does not exist
  str = str.trim()
  if(!/[!.?,:;]$/.test(str))
    str += '.'

  return str
}
module.exports.sentencify = sentencify
