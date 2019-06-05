/**
 * @module entity-game
 */

module.exports = {
  Dictionary: require('./Dictionary'),

  PredicateSyntax: require('./PredicateSyntax'),
  Predicate: require('./Predicate'),
  //PredicateSet: require('./PredicateSet'),


  Entity: require('./Entity'),
  parseImperative: require('./parseImperative'),
  Sentence: require('./Sentence'),
  S: require('./Sentence').S,
  //SentenceQueue: require('./SentenceQueue'),

  parse: require('./parse'),
  declare: require('./declare'),

  DescriptionContext: require('./DescriptionContext'),
  WanderingDescriber: require('./WanderingDescriber'),
  FactListener: require('./FactListener'),
  ContractionQueue: require('./ContractionQueue'),

  search: require('./search'),
  explore: require('./search').explore,

  sentencify: require('./util/spellcheck').sentencify,
  unSentencify: require('./util/unSentencify'),
  spellcheck: require('./util/spellcheck'),

  EntitySpawner: require('./EntitySpawner'),
  SentenceModifier: require('./SentenceModifier'),

  SpecialSyntax: require('./SpecialSyntax'),
  SpecialSentenceSyntax: require('./SpecialSentenceSyntax'),

  randomSentence: require('./randomSentence'),

  Declarer: require('./Declarer'),

  sub: require('./util/Substitution').sub,

  html: require('../HTML-io'),

  autodoc: require('./generateDictionaryDoc'),

  //util: require('./util'),
}
