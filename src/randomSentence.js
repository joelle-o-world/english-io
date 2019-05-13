const Sentence = require('./Sentence')
const {explore} = require('./search')

function randomUncheckedSentence(dictionary, domain) {
  // PRIVATE FUNCTION
  // 1. Choose a predicate that has all non-literal arguments
  let predicates = dictionary.predicates.nonLiteral
  let predicate = predicates[Math.floor(Math.random()*predicates.length)]

  // 2. Choose an entity from the domain for each argument
  let nArgs = predicate.params.length
  let args = []
  for(let i=0; i<nArgs; i++)
    args.push(domain[Math.floor(Math.random()*domain.length)])

  let sentence = new Sentence(predicate, args)

  return sentence
}

function randomSentence(dictionary, domain) {
  // 3. Check if there is a 'problem', if so return to step 1
  if(domain.isEntity)
    domain = [...explore([domain])]

  let sentence
  do {
    if(sentence)
      console.log('discarding:', sentence.str())
    sentence = randomUncheckedSentence(dictionary, domain)
  } while(sentence.getProblems())

  return sentence
}
module.exports = randomSentence

function randomUncheckedImperative(dictionary, subject, domain=subject) {
  if(domain.isEntity)
    domain = [...explore([domain])]

  let predicates = dictionary.predicates.predicates.filter(P => {
    return P.actionable && P.subjectArgIndexs && !P.hasLiterals
  })

  for(let j=0; j<100; j++) {
    let predicate = predicates[Math.floor(Math.random()*predicates.length)]
    let args = []
    for(let i=0; i<predicate.params.length; i++)
      args.push(domain[Math.floor(Math.random()*domain.length)])

    let subjectIndexs = predicate.subjectArgIndexs
    let subjectIndex = subjectIndexs[
      Math.floor(Math.random()*subjectIndexs.length)
    ]

    args[subjectIndex] = subject

    let sentence = new Sentence(predicate, args)
    let problems = sentence.getProblems()
    if(!problems)
      return sentence
    else
      console.log('discarding:', sentence.str())
  }
  return null
}
module.exports.imperative = randomUncheckedImperative
