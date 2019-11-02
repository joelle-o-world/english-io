
/* Convert a noun-phrase, proper-noun or pronoun to a possessive adjective. */
function toPossessiveAdjective(nounPhrase:string) {
  // handle special cases:
  switch(nounPhrase.toLowerCase()) {
    case 'i':
    case 'me':
      return 'my';

    case 'you':
      return 'your';

    case 'he':
    case 'him':
      return 'his';

    case 'she':
    case 'her':
      return 'her';

    case 'it':
      return 'its'

    case 'we':
      return 'our';

    case 'they':
    case 'them':
      return 'their';
  }

  // regular cases
  let lastWord = nounPhrase.slice(nounPhrase.lastIndexOf(' ')+1)
  if(lastWord[lastWord.length-1] == 's') {
    // Assume that words beginning with a capital letter are proper nouns
    if(/^[A-Z]/.test(lastWord))
      return nounPhrase + "\'s"
    else
      return nounPhrase + "\'"
  } else {
    return nounPhrase + "\'s"
  }
}
module.exports = toPossessiveAdjective
