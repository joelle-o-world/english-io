const PredicateSyntax = require('../src/PredicateSyntax')
const tenseList = require('../src/util/conjugate/verbPhrase').tenseList

let P = new PredicateSyntax({
  verb: 'eat', params:['subject', 'object'],
})

console.log(P)
console.log(tenseList)


for(let tense of tenseList.reverse()) {
  let reg = P.makeRegex(tense)
  console.log((tense+':')+'\n`'+reg+'`\n')

}
