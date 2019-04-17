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

  let phraselet = entityPhraselet(entity, ctx, options)

  // choose the article
  let article = 'the'
  let ordinalAdjective = null
  if(ctx) {
    let articles = ctx.getArticles(entity, phraselet)

    article = articles[Math.floor(Math.random()*articles.length)]

    // if using 'the', choose an ordinal adjective
    if(article == 'the') {
      let adjs = ctx.getOrdinalAdjectives(entity, phraselet)
      if(adjs)
        ordinalAdjective = adjs[Math.floor(Math.random()*adjs.length)]
    }
  }

  if(ordinalAdjective)
    phraselet = sub('_ _', ordinalAdjective, phraselet)


  // compile and return final string
  let str = sub('_ _', article, phraselet).str(ctx, options)
  if(ctx)
    ctx.log(entity, str)
  return str
}
module.exports = entityStr
