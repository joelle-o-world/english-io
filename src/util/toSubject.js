// get the subject-form of a pronoun

const subjectForms = {
  'him': 'he',
  'her': 'she',
  'them': 'they',
  'me': 'I',
}

function toSubject(str) {
  if(subjectForms[str])
    return subjectForms[str]
  else
    return str
}
module.exports = toSubject
