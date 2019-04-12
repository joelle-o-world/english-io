const Substitution = require('../src/util/Substitution')
const toPossessiveAdjective = require('../src/util/toPossessiveAdjective')

let sub1 = new Substitution("This _ is _'s _'s.", "moose", 'I', "masseuse")

console.log(sub1)
console.log(sub1.str())

console.log(Substitution.sub("_'s bit fits", 'it').str())
