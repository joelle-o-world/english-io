const placeholderRegex = /#_/g

class SentenceModifier {
  constructor(template, exec, {
    prefix = true,
    suffix = true,
    name,
  }={}) {

    this.template = template

    let placeholders = template.match(placeholderRegex)
    if(placeholders) {
      this.params = placeholders.map(ph => ({
        number: ph[0] == '#',
      }))
    }

    this.unboundRegex = new RegExp(
      template.replace(/#_/g, '([0-9.]+)')
    )

    /* Bool: whether the modifier can be prefixed to a sentence */
    this.prefix = prefix
    if(prefix)
      this.prefixRegex = new RegExp('^'+this.unboundRegex.source+',? ', 'i')

    /* Bool: whether the modifier can be suffixed to a sentence */
    this.suffix = suffix
    if(suffix)
      this.suffixRegex = new RegExp(',? '+this.unboundRegex.source+'$', 'i')

    this.name = name
    this.exec = exec
  }

  parse(str) {
    return (this.parsePrefix(str) || this.parseSuffix(str)) || null
  }

  parsePrefix(str) {
    if(!this.prefix)
      return null

    let result = this.prefixRegex.exec(str)
    if(result) {
      let args = this.parseArgs(result.slice(1))
      if(args)
        return {
          args: args,
          remainder: str.slice(result[0].length),
          modifier: this,
        }
    }

    return null
  }

  parseSuffix(str) {
    if(!this.suffix)
      return null

    let result = this.suffixRegex.exec(str)
    if(result) {
      let args = this.parseArgs(result.slice(1))
      if(args)
        return {
          args: args,
          remainder: str.slice(0, -result[0].length),
          modifier: this,
        }
    }
    return null
  }

  parseArgs(args) {
    for(let i in args)
      if(this.params[i].number) {
        args[i] = parseFloat(args[i])
        if(isNaN(args[i]))
          return null
      }

    return args
  }
}
SentenceModifier.prototype.isModifier = true
module.exports = SentenceModifier
