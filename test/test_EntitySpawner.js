const EntityConstructor = require('../src/EntitySpawner')



const d = require('../exampleDictionary.js')

let str = 'the dog who chases the cat'
let result = d.spawnSingle(str)
console.log('\''+str+'\' =', result)
