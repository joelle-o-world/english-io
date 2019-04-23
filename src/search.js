const getNounPhraselet = require('./util/getNounPhraselet')
const parseOrdinal = require('./util/parseOrdinal')

// search within a given iterator for a entity matching a given string.
function *searchForEntitys(matchStr, domain) {
  // if domain is a entity, use this entity as a starting point for an explore search
  if(domain.isEntity)
    domain = explore([domain])

  domain = [...domain]

  // TRY PUTTING THE ORDINAL SEARCH HERE
  let {phraselet, ordinal} = getNounPhraselet(matchStr)
  if(phraselet && ordinal) {
    let n = parseOrdinal(ordinal)
    if(n)
      for(let e of domain)
        if(e.matchesPhraselet(phraselet)) {
          n--
          if(n == 0) {
            yield e
            return
          }
        }
  }

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
