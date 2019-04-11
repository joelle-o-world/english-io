/**
  A subclass of Sentence. This class is used to represent a sentence (predicate
  + arguments) in the form of a noun. For example, "the cigarette that he was
  smoking".

  A NounPhraseSentence can be used as an argument in another sentence.
  @class NounPhraseSentence
  @extends Sentence
  @constructor
  @param {Number} mainArgumentIndex
  @param {Predicate} predicate
  @param {Array} args
*/

const Sentence = require('./Sentence')

class NounPhraseSentence extends Sentence {
  constructor(mainArgumentIndex, predicate, args) {
    super(predicate, args)
    this.mainArgumentIndex = mainArgumentIndex
  }

  /**
   * @attribute mainArgument
   * @readOnly
   */
  get mainArgument() {
    return this.args[this.mainArgumentIndex]
  }
}
NounPhraseSentence.prototype.isNounPhraseSentence = true
module.exports = NounPhraseSentence
