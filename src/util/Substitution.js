/*
  Substitution is a class for formatting sentence involving zero or more
  args. It can be used to avoid generating the noun phrases until the program
  is sure that they will be needed. A quick function Substitution.substitution
  can be used to format a one off string.
*/

const {randexp} = require("randexp")
const placeholderRegex = /(?:S|O|#)?_(?:'s)?/g // o = object, s = subject
const {autoBracket, kleenePoliteList} = require("./regOps")
const politeList = require('./politeList')
const toSubject = require('./toSubject')
const toPossessiveAdjective = require('./toPossessiveAdjective')


class Substitution { // sometimes abbreviated Sub
  constructor(templateStr, ...args) {
    this.template = templateStr
    this.args = args

    let placeholderMatches = this.template.match(placeholderRegex)
    if(placeholderMatches)
      this.placeholders = placeholderMatches.map(str => ({
        str: str,
        subject: str[0] == 'S',
        object: str[0] == 'O',
        number: str[0] == '#',
        possessive: /'s$/.test(str),
      }))
    else
      this.placeholders = []
  }

  getString(ctx, options) {
    let toSubIn = this.args.map(o => {
      if(o == null || o == undefined)
        return null
      else if(o.isEntity)
        return o.str(ctx, options)
      else if(o.constructor == String)
        return o
      else if(o.construtor == RegExp)
        return randexp(o)
      else if(o.constructor == Number)
        return o.toString()
      else if(o.isSubstitution)
        return o.getString(ctx, options)
      //else if(o.isAction) // not used in entity-game, only imaginary-city
      //  return o.str()
      else if(o.constructor == Array)
        return o.length ? Substitution.politeList(o).str(ctx, options) : 'nothing'
      else {
        console.warn("Couldn't interpret substitution value:", o, this)
        return "???"
      }
    })

    if(toSubIn.includes(null))
      return null

    return this.subIn(...toSubIn)
  }
  str(ctx, options) {
    // alias for getString
    return this.getString(ctx, options)
  }
  regex(depth) {
    // substitute regular expressions into the template for each arguments
    let toSubIn = this.args.map(o => formatRegex(o, depth))

    if(toSubIn.includes(null))
      return null

    toSubIn = toSubIn.map(autoBracket)
    return new RegExp(this.subIn(...toSubIn))
  }
  getRegex(depth) {
    // alias for backwards compatibility
    return this.regex(depth)
  }

  subIn(...subs) {
    // substitute strings into the template
    for(let i in subs) {
      let placeholder = this.placeholders[i]
      if(placeholder.subject)
        subs[i] = toSubject(subs[i])
      if(placeholder.possessive)
        subs[i] = toPossessiveAdjective(subs[i])
    }

    let bits = this.template.split(placeholderRegex)
    let out = bits[0]
    for(var i=1; i<bits.length; i++)
      out += subs[i-1] + bits[i]
    return out
  }

  static substitute(templateStr, ...args) {
    let ctx
    if(!args[args.length-1].isEntityenon)
      ctx = args.pop()
    else
      ctx = {}

    return new Substitution(templateStr, ...args).getString(ctx)
  }

  static politeList(items) {
    let placeholders = items.map(item => '_')
    let template = politeList(placeholders)
    return new Substitution(template, ...items)
  }

  static concat(...toConcat) {
    // concatenate many substitutions and strings into a new substitution
    let strs = []
    let args = []

    for(let bit of toConcat) {
      if(bit.constructor == String)
        strs.push(bit)
      if(bit.constructor == Substitution) {
        strs.push(bit.template)
        args = args.concat(bit.args)
      }
    }

    let template = strs.join('')
    return new Substitution(template, ...args)
  }

  static sub(...args) {
    return new Substitution(...args)
  }
}

Substitution.prototype.isSubstitution = true
Substitution.placeholderRegex = placeholderRegex
module.exports = Substitution

const formatRegex = (o, depth) => {
  if(o == null || o == undefined)
    return o
  else if(o.isEntity)
    return o.reg(depth).source
  else if(o.constructor == String)
    return o
  else if(o.constructor == RegExp)
    return autoBracket(o.source)
  else if(o.constructor == Number)
    return o.toString()
  else if(o.constructor == Array) {
    //throw "cannot (yet) generate regex from substitution containing an array"
    return kleenePoliteList(...o.map(formatRegex)).source
  } else if(o.isSubstitution) {
    let regex = o.getRegex()
    if(regex && regex.constructor == RegExp)
      return autoBracket(regex.source)
    else return null
  } else {
    console.warn("Couldn't interpret substitution value:", o)
    return "???"
  }
}
