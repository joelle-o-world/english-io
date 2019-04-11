/*
Tenses: [source ef.co.uk]
  - Simple Present ("They walk home.")
  - Present Continuous ("They are walking home.")
  - Simple Past ("Peter lived in China in 1965")
  - Past Continuous ("I was reading when she arrived.")
  - Present Perfect ("I have lived here since 1987.")
  - Present Perfect Continuous ("I have been living here for years.")
  - Past Perfect ("We had been to see her several times before she visited us")
  - Past Perfect continuous ("He had been watching her for some time when she
    turned and smiled.")
  - Future Perfect ("We will have arrived in the states by the time you get this
    letter.")
  - Future Perfect Continuous ("By the end of your course, you will have been
    studying for five years")
  - Simple Future ("They will go to Italy next week.")
  - Future Continuous ("I will be travelling by train.")


  (Maybe also include:
  - Zero conditional ("If ice gets hot it melts.")
  - Type 1 Conditional ("If he is late I will be angry.")
  - Type 2 Conditional ("If he was in Australia he would be getting up now.")
  - Type 3 Conditional ("She would have visited me if she had had time")
  - Mixed Conditional ("I would be playing tennis if I hadn't broken my arm.")
  - Gerund
  - Present participle)
*/

const conjugate = require("./conjugate")
const getPerson = require("./getPerson")
const {sub} = require('../Substitution')
//const Substitution = require("../Substitution")
const regOps = require("../regOps")

const GERUND = 7
const PAST_PARTICIPLE = 8
const PAST_TENSE = 9

const actionReservedWords = ['_verb', '_object', '_subject']

function verbPhrase(
  action,
  tense='simple_present',
  {
    omit=[],
    nounPhraseFor=null,
    prepositionClauseFor=null
  } = {}
) {
  if(prepositionClauseFor)
    return sub('that _', verbPhrase(
      action, tense, {omit: [prepositionClauseFor]}
    ))

  if(nounPhraseFor) {
    return sub(
      '_ that _',
      action[nounPhraseFor],
      verbPhrase(action, tense, {omit: nounPhraseFor}))
  }



  let vp = tenses[tense](action)

  if(action._object && omit != '_object')
    vp = sub("_ O_", vp, action._object)

  for(var prep in action) {
    if(!actionReservedWords.includes(prep))
      if(omit == prep)
        vp = sub('_ _', vp, prep)
      else
        vp = sub('_ _ _', vp, prep, action[prep])
  }

  if(omit != '_subject' && tense != 'imperative')
    vp = sub('S_ _', action._subject, vp)

  return vp
}

function contractBySubject(actions, tense) {
  // format a set of actions as a contracted phrases sharing the same subject

  // first check that the subjects match
  let subject = actions[0]._subject
  for(let action of actions)
    if(action._subject != subject)
      throw "cannot perform contraction because the subjects do not match"

  return sub(
    '_ _', subject,
    actions.map(action => verbPhrase(action, tense, {omit:['_subject']}))
  )
}

function anyTenseRegex(verb) {
  let action = {_verb:verb, _subject:'_subject'}
  let forms = []
  for(var i in tenses) {
    let form = tenses[i](action)
    if(form.isSubstitution)
      form = form.getRegex()
    forms.push(form)
  }

  return regOps.or(...forms)
}

const tenses = {
  simple_present(action) {
    let person = getPerson(action._subject)
    return sub(
      "_",
      conjugate(action._verb, person)
    )
  },

  present_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      "_ _",
      conjugate('be', person),
      conjugate(action._verb, GERUND)
    )
  },

  simple_past(action) {
    let person = getPerson(action._subject)
    return sub(
      '_',
      conjugate(action._verb, PAST_TENSE)
    )
  },

  past_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('were', person),
      conjugate(action._verb, GERUND)
    )
  },

  present_perfect(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('have', person),
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  present_perfect_continuous(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ been _',
      conjugate('have', person),
      conjugate(action._verb, GERUND)
    )
  },

  past_perfect(action) {
    let person = getPerson(action._subject)
    return sub(
      '_ _',
      conjugate('have', person),
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  past_perfect_continuous(action) {
    return sub(
      'had been _',
      conjugate(action._verb, GERUND)
    )
  },

  future_perfect(action) { // we will have verbed
    return sub(
      'will have _',
      conjugate(action._verb, PAST_PARTICIPLE)
    )
  },

  // Future Perfect Continuous ("you will have been studying for five years")
  future_perfect_continuous(action) {
    return sub(
      'will have been _',
      conjugate(action._verb, GERUND)
    )
  },

  // Simple Future ("They will go to Italy next week.")
  simple_future(action) {
    return sub(
      'will _',
      action._verb,
    )
  },

  // Future Continuous ("I will be travelling by train.")
  future_continuous({_subject, _verb}) {
    return sub(
      'will be _',
      conjugate(_verb, GERUND)
    )
  },

  imperative({_verb}) {
    return sub(_verb)
  },

  negative_possible_present({_subject, _verb}) {
    return sub('cannot _', _verb)
  },
  negative_possible_past({_subject, _verb}) {
    return sub('could not _', _verb)
  },
}

function tenseType(tense) {
  if(tense.includes('past'))
    return 'past'
  else if(tense.includes('present'))
    return 'present'
  else if(tense.includes('future'))
    return 'future'
  else
    return undefined
}

module.exports = verbPhrase
verbPhrase.contractBySubject = contractBySubject
verbPhrase.tenses = tenses
verbPhrase.tenseList = Object.keys(tenses).reverse() // in descending order of complexity
verbPhrase.anyTenseRegex = anyTenseRegex
verbPhrase.getTenseType = tenseType
