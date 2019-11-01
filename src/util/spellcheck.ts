/** Finds 'a' articles that precede a vowel. */
const reg = /(?<=^| )a?(?= [aeiou])/ig
/** Finds 'an' articles that dont precede a vowel. */
const reg2 = /(?<=^| )(?:an)?(?= [^aeiou])/ig

/** Spellcheck a string:
 *  - Corrects indefinite articles.
 */
function spellcheck(str:string) {
  return str.replace(reg, 'an').replace(reg2, 'a')
}

/** Turn a string into a sentence:
 *  - Auto capitalise the last letter
 *  - Ensure it ends with a full-stop or some other terminal.
 *  - Corrects the spelling of indefinite articles
 */
function sentencify(str:string) {
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

export {spellcheck, sentencify}