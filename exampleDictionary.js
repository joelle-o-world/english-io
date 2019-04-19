const {Dictionary, Predicate} = require('./src/')

const d = new Dictionary()
  .addNouns(
    'cat',
    {
      noun:'dog',
      spawners: [{
        template: "woofing dog",
        construct() {
          let dog = this.dictionary.createEntity()
          dog.be_a('dog')
          this.dictionary.S('Woof', dog).start() // the dog woofs
          return e
        }
      }]
    }
  )
  .addEntitySpawner({
    template: '_ who chases _', phraseletMode: false,
    construct(a, b) {
      this.dictionary.S('Chase', a, b).start() // a chases b
      return a
    },
  })
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

    new Predicate({
      verb: 'chase', params:['subject', 'object']
    })
  )

module.exports = d
