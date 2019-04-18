const d = require('../exampleDictionary')


let [dog, cat] = d.spawn('a dog', 'a cat')

// the dog woofs
let sentence1 = d.S('Woof', dog)
// the cat meows
let sentence2 = d.S('Meow', cat)

sentence1.start()
sentence2.addCause(sentence1)

console.log(sentence2.truthValue)


let stuff = d.quickDeclare(
  'a cat sleeps'
)
let cat2 = stuff[0]
console.log(cat2.facts.map(fact => fact.str()))

cat2.facts[0].stop() // the cat stops sleeping

console.log(cat2.history.map(fact => fact.str('simple_past')))
