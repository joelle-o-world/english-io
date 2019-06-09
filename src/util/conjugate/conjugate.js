/*
  Given the infinitive form of a verb and a person/verbform number (0-8) return
  the conjugated verb form.
*/

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7.  gerund/present-participle)
  (8.  past-participle)
  (9. past tense form)
*/

const regOp = require("../regOps")
const irregular = require("./irregularConjugations")

const endsWithShortConsonant = /[aeiou][tpdn]$/
const endsWithE = /e$/
const endsWithOOrX = /[oxzs]$/

const FIRST_PERSON_SINGULAR = 1   // I
const SECOND_PERSON_SINGULAR = 2  // you
const THIRD_PERSON_SINGULAR = 3   // he/she/it
const FIRST_PERSON_PLURAL = 4     // we
const SECOND_PERSON_PLURAL = 5    // you
const THIRD_PERSON_PLURAL = 6     // they
const GERUND = 7
const PAST_PARTICIPLE = 8
const PAST_TENSE = 9
const ALL_PERSON_REGEX = 10

function conjugate(verb, form) {

  let i1 = verb.search(/[ .,!?]/)


  if(i1 == -1) {
    infinitive = verb
    extra = ''
  } else {
    infinitive = verb.slice(0, i1)
    extra = verb.slice(i1)
  }

  let conjugated
  if(form == ALL_PERSON_REGEX)
    conjugated = anyPersonRegex(infinitive)
  if(irregular[infinitive] && irregular[infinitive][form])
    conjugated = irregular[infinitive][form]
  else
    conjugated = conjugateRegular(infinitive, form)

  return conjugated + extra
}

function conjugateRegular(infinitive, form) {
  switch(form) {
    // third person singular
    case THIRD_PERSON_SINGULAR:
      if(endsWithOOrX.test(infinitive))
        return infinitive+'es'
      else
        return infinitive+'s'

    // gerund
    case GERUND:
      if(endsWithE.test(infinitive))
        return infinitive.slice(0, infinitive.length-1)+'ing'
      if(endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length-1]+'ing'
      return infinitive+'ing'

    // past participle
    case PAST_TENSE:
    case PAST_PARTICIPLE:
      if(endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length-1]+'ed'
      if(endsWithE.test(infinitive))
        return infinitive+'d'
      else
        return infinitive+'ed';

    case ALL_PERSON_REGEX:
      return anyPersonRegex(infinitive)
      break;

    default:
      return infinitive
  }
}

function anyPersonRegex(infinitive) {
  let forms = []
  for(let person=1; person<=6; ++person) {
    let form = conjugate(infinitive, person)
    if(!forms.includes(form))
      forms.push(form)
  }
  return regOp.or(...forms)
}


module.exports = conjugate
conjugate.anyPersonRegex
