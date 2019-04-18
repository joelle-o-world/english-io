const {Dictionary, Predicate} = require('./src/')

const d = new Dictionary()
  .addNouns('cat', 'dog')
  .addPredicates(
    new Predicate({
      verb: 'meow', params:['subject'],
      problem: e => !e.is_a('cat')
    }),

    new Predicate({
      verb: 'woof', params:['subject'],
      problem: e => !e.is_a('dog')
    }),

    new Predicate({verb:'lie down'}),
    new Predicate({
      verb:'sleep', params:['subject'],
      meanwhile(subject) {
        return d.S('LieDown', subject)
      }
    }),

    new Predicate({
      verb: 'speak', params:['subject'],
      replace(subject) {
        if(subject.is_a('dog'))
          return d.S('Woof', subject)
        else if(subject.is_a('cat'))
          return d.S('Meow', subject)
      }
    }),

  )

module.exports = d
