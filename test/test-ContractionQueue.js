const ContractionQueue = require('../src/ContractionQueue')

const d = require('../exampleDictionary')


let TheDog = d.spawnSingle('the dog')
let TheCat = d.spawnSingle('the cat')


let q = new ContractionQueue
q.add(
  d.S('Pat', TheDog),
)

console.log(q.next())
