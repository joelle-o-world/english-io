const ContractionQueue = require('../src/ContractionQueue')

const d = require('../exampleDictionary')


let TheDog = d.spawnSingle('the dog')
let TheCat = d.spawnSingle('the cat')


let q = new ContractionQueue
q.add(
  "Welcome",
  d.S('Pat', TheDog),
  d.S('Pat', TheCat),
  d.S('Woof', TheDog),
  d.S('Chase', TheCat, TheDog),
  "Goodbye"
)

let msg
while(msg = q.next()) {
  if(msg.str)
    console.log(msg.str())
  else
    console.log(msg)
}
