const {sub} = require('./util/Substitution')

class SubjectContractedSentax {
  constructor(...sentaxs) {
    this.subject = sentaxs[0].subject
    for(let sentax of sentaxs)
      if(sentax.subject != this.subject)
        throw 'Subjects must match in a SubjectContractedSentax'

    this.sentaxs = sentaxs
  }

  compose() {
    let preds = this.sentaxs.map(sentax => sentax.compose({omit:'_subject'}))
    return sub('S_ _', this.subject, preds)
  }

  str(ctx, entityStrOptions) {
    return this.compose().str(ctx, entityStrOptions)
  }
}
SubjectContractedSentax.prototype.isSubjectContractedSentax = true
module.exports = SubjectContractedSentax
