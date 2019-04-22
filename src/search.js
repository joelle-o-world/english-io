// search within a given iterator for a entity matching a given string.

//const spawn = require('./spawn')

function *searchForEntitys(matchStr, domain) {
  // if domain is a entity, use this entity as a starting point for an explore search
  if(domain.isEntity)
    domain = explore([domain])

  for(let entity of domain) {
    if(entity.matches(matchStr))
      yield entity
  }
}

function findFirst(matchStr, domain) {
  for(let entity of searchForEntitys(matchStr, domain))
    return entity

  return null
}

/*function findOrSpawn(matchStr, domain) {
  let result = findFirst(matchStr, domain)
  if(result)
    return result
  else
    return spawn(matchStr)
}*/

function* explore(startingPoint) {
  let toSearch = startingPoint.slice()
  for(let i=0; i<toSearch.length; i++) {
    yield toSearch[i]
    for(let entity of immediateRelations(toSearch[i]))
      if(!toSearch.includes(entity))
        toSearch.push(entity)
  }
}

function immediateRelations(entity) {
  let list = []
  for(let fact of entity.facts)
    for(let arg of fact.entityArgs)
      if(!list.includes(arg))
        list.push(arg)
  for(let fact of entity.history)
    for(let arg of fact.entityArgs)
      if(!list.includes(arg))
        list.push(arg)
  return list
}


module.exports = searchForEntitys
module.exports.explore = explore
module.exports.first = findFirst
//module.exports.orSpawn = findOrSpawn
