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

  DescriptionContext: require('./DescriptionContext'),
  WanderingDescriber: require('./WanderingDescriber'),
  FactListener: require('./FactListener'),

  search: require('./search'),

  sentencify: require('./util/spellcheck').sentencify,

  EntitySpawner: require('./EntitySpawner'),
  SentenceModifier: require('./SentenceModifier'),

  Declarer: require('./Declarer'),

  sub: require('./util/Substitution').sub,

  html: require('../HTML-io'),

  //util: require('./util'),
}
