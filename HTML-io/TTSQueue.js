/**
  A class for scheduling text to speech in a queue using the Responsive Voice
  API.

  @class TTSQueue
  @constructor
  @param {ResponsiveVoice} responsiveVoice
*/

class TTSQueue {
  constructor(responsiveVoice) {
    /**
     * An array of triplets: (text, voice, parameters) which are scheduled to
     * be sent to responsive voice consequetively.
     * @property {Array} queue
     */
    this.queue = []
    this.nowPlaying = null
    this.rv = responsiveVoice
  }

  /**
   * Play an utterance, or add it to the end of the queue.
   * @method speak
   * @param {String} text
   * @param {String} voice
   * @param {Object} parameters Parameters for configuring responsive voice.
   */
  speak(text, voice, parameters) {
    if(!(/\w/).test(text))
      return "nah"

    if(this.nowPlaying)
      this.queue.push([text, voice, parameters])
    else
      this.playNow(text, voice, parameters)
  }

  /**
   * Play an utterance immediately.
   * @method playNow
   * @param {String} text
   * @param {String} voice
   * @param {Object} parameters Parameters for configuring responsive voice.
   */
  playNow(text, voice, parameters) {
    parameters = Object.assign({}, parameters)
    parameters.onend = () => this.next()
    this.rv.speak(text, voice, parameters)
    this.nowPlaying = [text, voice, parameters]
  }

  /**
   * Advance to the next utterance in the queue or call `.done()`.
   * @method next
   */
  next() {
    this.nowPlaying = null
    if(this.queue.length)
      this.playNow(...this.queue.shift())
    else
      this.done()
  }

  /**
   * Called when the end of the queue is reached.
   * @method done
   */
  done() {
    this.nowPlaying = null
    if(this.onDone)
      this.onDone()
  }
}
module.exports = TTSQueue
