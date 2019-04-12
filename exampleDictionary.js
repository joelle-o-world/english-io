const {Dictionary, Predicate} = require('./src/')

const d = new Dictionary()
d.addNouns('cat', 'dog')
d.addPredicates(
  new Predicate({
    verb: 'meow', params:['subject'],
    problem: e => !e.is_a('cat')
  })
)

module.exports = d
