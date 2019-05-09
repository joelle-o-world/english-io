const SentenceModifier = require('./SentenceModifier')

class SentenceModifierSet {
  constructor(...modifiers) {
    this.modifiers = []

    for(let modifier of modifiers)
      this.addModifier(modifier)
  }

  addModifier(mod) {
    if(!mod.isModifier)
      mod = new SentenceModifier(mod)

    if(mod.isModifier)
      this.modifiers.push(mod)
  }

  parse(str) {
    // first check all prefixes
    for(let mod of this.modifiers){
      let result = mod.parsePrefix(str)
      if(result)
        return result
    }

    // then check all suffixes
    for(let mod of this.modifiers) {
      let result = mod.parseSuffix(str)
      if(result)
        return result
    }

    // otherwise
    return null
  }
}
module.exports = SentenceModifierSet
