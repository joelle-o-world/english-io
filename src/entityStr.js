/*
  entityStr()
  Convert a entity into a string using a flexible set of parameters
*/

const {sub} = require('./util/Substitution')
const specarr = require('./util/specarr')

function entityStr(entity, ctx, options={}) {
  // Convert a entity into a noun phrase string.

  if(!ctx)
    null//console.warn( "call to entityStr without a description context" )
  else {
    let pronoun = ctx.getPronounFor(entity)
    if(pronoun) {
      ctx.log(entity, pronoun)
      return pronoun
    }
  }

  if(typeof options == 'number')
    options = {maxDetails: options}

  // max details default logic, yuck
  if(options.maxDetails == undefined)
    options.maxDetails = 0
  if(options.maxAdjectives == undefined) {
    if(options.maxPrepositionClauses == undefined) {
      // both undefined, distribute at random
      options.maxPrepositionClauses = Math.floor(Math.random() * (options.maxDetails+1))
      options.maxAdjectives = options.maxDetails - options.maxPrepositionClauses
    } else
      // only maxAdjectives is undefined
      options.maxAdjectives = options.maxDetails-options.maxPrepositionClauses
  } else if(options.maxPrepositionClauses == undefined)
    // only maxPrepositionClauses is undefined
    options.maxPrepositionClauses = options.maxDetails-options.maxAdjectives

  delete options.maxDetails

  // destructure options and apply default values
  let {
    article='the',          // article to use
    //maxDetails = undefined, // max number of details to give (including nested)
    maxAdjectives = undefined,  // max number of adjectives to use (inc. nested)
    maxPrepositionClauses=undefined,  // max number of preposition clauses to use (inc. nested)
    nounSpecificness=1,     // scale 0-1, how specific should the noun be
    //dontMention,          // list of entities not to mention
    //recursionDepth=3,       // limit the number of recursive entityStr calls
  } = options
  delete options.article

  // compose the string
  let out = entity.nouns[Math.floor(nounSpecificness*(entity.nouns.length-0.5))]

  // choose and apply preposition clauses
  if(maxPrepositionClauses) {
    let nClauses = Math.floor(Math.random() * (maxPrepositionClauses+1))
    if(nClauses) {
      // prepare list of all possible clauses
      let allClauses = []
      for(let prep in entity.prepositionClauses)
        allClauses.push(...specarr.expand(entity, entity.prepositionClauses[prep]).map(
          clause => sub('_ _', prep, clause)
        ))

      // chooses clauses to use
      let clauses = []
      for(let i=0; i<nClauses && allClauses.length; i++) {
        clauses.push(
          allClauses.splice(Math.floor(Math.random() * allClauses.length), 1)
        )

        // decrement maxPrepositionClauses in options (effects recursive calls/callers)
        options.maxPrepositionClauses--
      }

      // append chosen clauses to output
      if(clauses.length)
        out = sub('_ _', out, clauses.sort(() => Math.random()*2-1))
    }
  }

  // choose and apply adjectives
  if(maxAdjectives) {
    let nAdjs = Math.floor(Math.random() * (maxAdjectives+1))
    if(nAdjs) {
      let allAdjs = specarr.expand(entity, entity.adjectives)

      // choose adjectives
      let adjs = []
      for(let i=0; allAdjs.length && i<nAdjs; i++) {
        adjs.push(allAdjs.splice(Math.floor(Math.random() * allAdjs.length), 1))
        options.maxAdjectives--
      }

      // prepend chosen adjectives to output
      if(adjs.length)
        out = sub('_ _', adjs.sort(() => Math.random()*2-1), out)
    }
  }

  let str = sub('_ _', article, out).str(ctx, options)
  if(ctx)
    ctx.log(entity, str)
  return str
}
module.exports = entityStr
