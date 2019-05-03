const Sentax = require('./Sentax')

class ContractionQueue {
  constructor() {
    this.queue = []
  }

  add(...sentences) {
    this.queue.push(...sentences)
  }

  next() {
    // Contract the maximum number of sentences into one, starting from the
    // front of the queue.

    if(this.queue.length == 0)
      return null // queue is empty

    if(!this.queue[0].isSentence)
      return this.queue.shift()

    let winner = null
    let winningDepth = -1
    for(let form of this.queue[0].sentaxs().sort(() => Math.random()*2-1)) {
      let A = form
      let i
      for(i=1; i<this.queue.length && this.queue[i].isSentence; i++) {
        let success = false
        for(let B of this.queue[i].sentaxs()) {
          let C = Sentax.contractPair(A, B)
          if(C) {
            A = C
            success = true
            break
          }
        }

        if(!success)
          break
      }

      let depth = i-1
      if(depth > winningDepth) {
        winningDepth = depth
        winner = A
      }
    }

    this.queue = this.queue.slice(winningDepth+1)
    return winner
  }
}
module.exports = ContractionQueue
