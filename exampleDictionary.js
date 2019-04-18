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
      verb:'sleep',
      meanwhile(subject) {
        return d.S('LieDown', subject)
      }
    })

  )

module.exports = d
