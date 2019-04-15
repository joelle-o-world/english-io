/*
  entityStr()
  Convert a entity into a string using a flexible set of parameters
*/

const {sub} = require('./util/Substitution')
const specarr = require('./util/specarr')
const entityPhraselet = require('./Entity_nounPhraseletStr')

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

  let out = entityPhraselet(entity, ctx, options)

  let str = sub('_ _', 'the', out).str(ctx, options)
  if(ctx)
    ctx.log(entity, str)
  return str
}
module.exports = entityStr
