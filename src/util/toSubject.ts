// get the subject-form of a pronoun

const subjectForms:{[key: string]: string|undefined} = {
  'him': 'he',
  'her': 'she',
  'them': 'they',
  'me': 'I',
}

/** Convert a string to the subject form if it is a pronoun, otherwise return it unaltered. */
function toSubject(str:string) {
  return subjectForms[str] || str
}
module.exports = toSubject
