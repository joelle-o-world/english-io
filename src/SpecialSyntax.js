const placeholderRegex = /(?:@|#|L|~)?_/g
const parse = require('./parse')
const politeList = require('./util/politeList')

class SpecialSyntax {
  constructor(template) {
    this.template = template
    this.params = []
    this.dictionary = null

    let regsrc = template
    let ph
    while(ph = placeholderRegex.exec(template)) {
      ph = ph[0]
      let param = {
        NP: ph[0] == '_',   // entity
        list: ph[0] == 'L',     // list of entities
        number: ph[0] == '#',   // number
        literal: ph[0] == '@',  // string
        sentence: ph[0] == '~'  // sentence
      }
      this.params.push(param)


      regsrc = regsrc.replace(ph, param.number ? '([0-9\.]+)' : '(.+)')
    }

    this.regexUnbounded = new RegExp(regsrc, 'i')
    this.regex = new RegExp('^' + regsrc + '$', 'i')
  }

  parse(str, ctx, subject) {
    if(!this.dictionary)
      throw 'SpecialSyntax cannot parse without a dictionary'

    let result = this.regex.exec(str)
    if(!result)
      return null

    // Otherwise,
    let args = result.slice(1)
    for(let i in this.params) {
      let param = this.params[i]

      // parse as NounPhrase
      if(param.NP) {
        args[i] = parse.nounPhrase(args[i], this.dictionary, ctx)
        if(!args[i])
          return null
      }

      else if(param.number) {
        args[i] = parseFloat(args[i])
        if(isNaN(args[i]))
          return null
      }

      else if(param.list) {
        let list = politeList.parse(args[i])
        if(!list)
          return null
        for(let j in list) {
          list[j] = parse.nounPhrase(list[j], this.dictionary, ctx)
          if(!list[j])
            return null
        }
      }

      else if(param.literal) {
        continue
      }

      else if(param.sentence) {
        let sentence = parse.sentence(args[i], this.dictionary, ctx)

        if(!sentence && subject)
          sentence = parse.imperative(subject, args[i], this.dictionary, ctx)

        if(sentence)
          args[i] = sentence
        else
          return null
      }
    }

    return args
  }
}
SpecialSyntax.prototype.isSpecialSyntax = true
module.exports = SpecialSyntax
