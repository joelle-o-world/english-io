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

  DescriptionContext: require('./DescriptionContext'),
  WanderingDescriber: require('./WanderingDescriber'),
  FactListener: require('./FactListener'),

  search: require('./search'),

  sentencify: require('./util/spellcheck').sentencify,
  unSentencify: require('./util/unSentencify'),

  EntitySpawner: require('./EntitySpawner'),
  SentenceModifier: require('./SentenceModifier'),

  SpecialSyntax: require('./SpecialSyntax'),
  SpecialSentenceSyntax: require('./SpecialSentenceSyntax'),

  randomSentence: require('./randomSentence'),

  Declarer: require('./Declarer'),

  sub: require('./util/Substitution').sub,

  html: require('../HTML-io'),

  //util: require('./util'),
}
