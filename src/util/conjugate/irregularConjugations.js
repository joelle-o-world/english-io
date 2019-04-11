// list of irregular verbs with their conjugations.
// (indexed by infinitive)

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

module.exports = {
  // be IS THIS EVEN A VERB?
  be: {
    1: 'am', 2:'are', 3:'is', 4:'are', 5:'are', 6:'are', 7:'being', 8:'been',
    9:'was',
  },

  say: {8:'said', 9:'said'},

  make: {8: 'made', 9: 'made'},
  go:   {8: 'gone', 9: 'went'},
  take: {8: 'taken',9: 'took'},
  come: {8: 'come', 9: 'came'},
  see: {7: 'seeing', 8:'seen', 9:'saw'},
  know: {8: 'known', 9:'knew'},
  get: {8:'got', 9:'got'},
  run: {8:'run', 9:'ran'},
  were: {1:'was', 3:'was'}, // this is a cludge and i know it
  have: {3:'has', 8:'had', 9:"had"},
  eat: {7:'eating', 8:'eaten', 9:'ate'},
  contain: {7:'containing', 8:'contained', 9:'contained'},
  hold: {8:'held', 9:'held'},
  put: {8:'put', 9:'put'},
  poop: {7:'pooping', 8:'pooped', 9:'pooped'},
  steal: {7:'stealing', 8:'stolen', 9:'stole'},
  lead: {7:'leading', 8:'lead', 9:'lead'},
  // give
  // find
  // think
  // tell
  // become
  // show
  // leave
  // feel
  // bring
  // begin
  // keep
  // write
  // stand
  // hear
  // let
  // mean
  // set
  // meet
  // pay
  // sit
  // speak
  // lie
  // lead
  // read
  // grow
  // lose
  // fall
  // send
  // build
  // understood
  // draw
  // break
  // spend
  // cut
  // rise
  // drive
  // buy
  // wear
  // choose

  // to shit

}
