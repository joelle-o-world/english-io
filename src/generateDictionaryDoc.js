function generateDictionaryDoc(dictionary) {
  let demos = {}

  for(let predicate of dictionary.predicates.predicates) {
    for(let syntax of predicate.forms){
      let a = syntax.demos()
      for(let tense in a) {
        if(!demos[tense])
          demos[tense] = []
        demos[tense].push(a[tense])
      }
    }
  }

  for(let type in demos) {
    demos[type] = demos[type].sort()
      .filter((item, i, arr) => arr.indexOf(item) == i),
  }

  return demos

  
}
module.exports = generateDictionaryDoc
