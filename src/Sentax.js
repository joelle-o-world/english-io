const {sub} = require('./util/Substitution')
const verbPhrase = require('./util/conjugate/verbPhrase')
const SubjectContractedSentax = require('./SubjectContractedSentax')

/**
 * Contraction of Sentence-syntax.
 */
class Sentax {
  constructor({verb, args={}, tense='simple_present'}) {
    this.verb = verb
    this.args = args
    this.tense = tense
  }

  get subject() {
    return this.args._subject
  }
  set subject(subject) {
    this.args._subject = subject
  }

  get object() {
    return this.args._object
  }
  set object(object) {
    this.args._object = object
  }

  composeAction() {
    let action = {}
    Object.assign(action, this.args)
    action._verb = this.verb
    return action
  }

  compose(verbPhraseOptions) {
    return verbPhrase(this.composeAction(), this.tense, verbPhraseOptions)
  }

  str(ctx, entityStrOptions) {
    return this.compose().str(ctx, entityStrOptions)
  }

  static merge(...sentaxs) {
    let verb = sentaxs[0].verb
    let tense = sentaxs[0].tense

    let args = {}
    for(let sentax of sentaxs) {
      if(sentax.verb != verb || sentax.tense != tense) {
        console.warn('cannot merge sentaxs whos verbs and tense don\'t agree')
        return null
      }

      for(let key in sentax.args) {
        let arg = sentax.args[key]
        if(arg.constructor != Array)
          arg = [arg]

        if(!args[key])
          args[key] = []

        for(let e of arg)
          if(!args[key].includes(e))
            args[key].push(e)
      }
    }

    for(let i in args)
      if(args[i].length == 1)
        args[i] = args[i][0]

    return new Sentax({
      verb: verb,
      tense: tense,
      args: args,
    })
  }

  static contractPair(A, B) {
    if(!B.isSentax)
      throw 'improper use of Sentax.contractPair'
    if(A.isSentax) {
      if(A.verb == B.verb && A.subject == B.subject && A.tense == B.tense)
        return Sentax.merge(A, B)
      else if(A.subject == B.subject)
        return new SubjectContractedSentax(A, B)
      else return null
    } else if(A.isSubjectContractedSentax) {
      if(A.subject == B.subject) {
        for(let i in A.sentaxs) {
          let C = A.sentaxs[i]
          if(C.verb == B.verb && C.tense == B.tense) {
            A.sentaxs[i] = Sentax.merge(C, B)
            let out = new SubjectContractedSentax(...A.sentaxs)
            out.sentaxs[i] = Sentax.merge(C, B)
            return out
          }
        }

        // otherwise)
        return new SubjectContractedSentax(...A.sentaxs, B)
      }
    }
  }

  static *contract(...sentaxs) {
    for(let i=0; i<sentaxs.length; i++) {
      let A = sentaxs[i]
      let j
      for(j=i+1; j<sentaxs.length; j++) {
        let B = sentaxs[j]
        let C = Sentax.contractPair(A, B)
        if(C)
          A = C
        else
          break
      }
      i = j - 1

      yield A
    }
  }
}
Sentax.prototype.isSentax = true
module.exports = Sentax
