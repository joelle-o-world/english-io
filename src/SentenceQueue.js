// a list of sentence to be executed consequetively
const {sub} = require('./util/Substitution')

const EventEmitter = require('events')

/**
 * @class SentenceQueue
 * @extends EventEmitter
 * @constructor
 * @param {Sentence} ...sentences
 */

class SentenceQueue extends EventEmitter {
  constructor(...sentences) {
    super()

    /**
     * @property {Array} sentence
     */
    this.sentences = []
    /**
     * Index of the next sentence to start.
     * @property {Number} i
     */
    this.i = 0

    for(let sentence of sentences)
      this.appendSentence(sentence)
  }

  /**
   * Adds a sentence to the end of the queue.
   * @method appendSentence
   * @param {Sentence} sentence
   */
  appendSentence(sentence) {
    if(sentence && sentence.truthValue == 'hypothetical') {
      this.sentences.push(sentence)
      sentence.truthValue = 'planned'
    } else
    throw "Can only append hypothetical sentence to queue."
  }

  /**
   * Begin processing the queue.
   * @method start
   */
  start() {
    /**
     * @event start
     */
    this.emit('start')
    this.startNextSentence()
  }

  /**
   * Start the next sentence in the queue and increment `i`, or emit `stop` (if
   * reached the end).
   * @method startNextSentence
   */
  startNextSentence() {
    let sentence = this.sentences[this.i++]

    if(sentence) {
      //sentence.once('stop', () => this.startNextSentence())
      //sentence.on('problem', reasons => this.emit('problem', reasons))
      let result = sentence.start()
      switch(result.truthValue) {
        case 'skipped': // sentence was skipped
        case 'past': // sentence was instantaneously true
          // start next sentence immediately
          this.startNextSentence()
          break;

        case 'planned': // sentence start has been postponed to a later time
        case 'true': // sentence started straight away
          // wait for stop event, then start next sentence
          result.once('stop', () => this.startNextSentence())
          break

        case 'failed':
          let reason = sub(
            '_ because _',
            result.str('negative_possible_present'),
            result.failureReason,
          )
          this.fail(reason)
          break;

        default:
          // send a warning if truth value can't be handled
          console.warn(
            'SentenceQueue found sentence',
            result, '('+result.str()+')',
            'with unexpected truth value:',
            result.truthValue,
          )
      }

    } else {
      /**
       * @event stop
       */
      this.emit('stop')
    }
  }

  fail(reasons) {
    this.emit('problem', reasons)
  }
}
module.exports = SentenceQueue
