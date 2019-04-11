const search = require('./search')
const Sentence = require('./Sentence')


function *parseImperative(str, subject, predicateSet) {
  // parse the string using predicate set
  let interpretations = predicateSet.parseImperative(str, subject)

  // search for matches to the arguments using explore
  for(let interpretation of interpretations) {
    let argOptionsMatrix = []
    let nCombinations = 1
    for(let i=0; i<interpretation.args.length && nCombinations; ++i) {
      let arg = interpretation.args[i]

      // leave literal args alone
      if(interpretation.predicate.params[i].literal)
        argOptionsMatrix[i] = [arg]

      else if(arg.isEntity) // leave args which are already entitys alone
        argOptionsMatrix[i] = [arg]

      else if(arg.constructor == String) {
        // try to find a match for the args which are strings
        argOptionsMatrix[i] = []
        for(let match of search(arg, subject))
          argOptionsMatrix[i].push(match)
      }

      nCombinations *= argOptionsMatrix[i].length
    }


    for(let permutation=0; permutation<nCombinations; ++permutation) {
      let args = []
      let p = permutation
      for(let options of argOptionsMatrix) {
        let i = p % options.length
        args.push(options[i])

        p = (p-i) / options.length
      }

      let sentence = new Sentence(interpretation.predicate, args)
      yield sentence
    }
  }
}
module.exports = parseImperative

function parseFirstImperative(str, subject, predicateSet) {
  for(let sentence of parseImperative(str, subject, predicateSet))
    return sentence
  return null
}
module.exports.first = parseFirstImperative
