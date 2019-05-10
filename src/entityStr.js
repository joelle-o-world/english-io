/*
  entityStr()
  Convert a entity into a string using a flexible set of parameters
*/

const {sub} = require('./util/Substitution')
const specarr = require('./util/specarr')
const entityPhraselet = require('./Entity_nounPhraseletStr')

function entityStr(entity, ctx, options={}) {
  // Convert an Entity into a noun phrase string.

  if(ctx) {
    let pronoun = ctx.getPronounFor(entity)
    if(pronoun) {
      ctx.log(entity, pronoun)
      return pronoun
    }
  }

  let properNoun = specarr.randomString(entity, entity.properNouns, ctx)
  if(properNoun) {
    if(ctx)
      ctx.log(entity, properNoun)
    return properNoun
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
