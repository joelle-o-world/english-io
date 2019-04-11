/**
 * A class for animating the process of writing of text to a HTML element,
 * character by character.
 * @class TickyText
 * @constructor
 * @param {DOMElement} targetElement
 */

class TickyText {
  constructor(targetElement) {
    /**
     * The queue of strings to write.
     * @property {Array} queue
     */
    this.queue = []

    /**
     * @property {Number} placeInCurrent
     */
    this.placeInCurrent = 0 // Index of next character to print from

    /**
     * @property {Timeout} intervalTimer
     */
    this.intervalTimer = null

    /**
     * @property {String} str
     */
    this.str = ""

    /**
     * milliseconds between ticks
     * @property {Number} speed
     * @default 25
     */
    this.speed = 25 // ms

    /**
     * @property {DOMElement} targetElement
     */
    this.targetElement = targetElement
  }

  /**
   * strings to add to the queue
   * @method write
   * @param {String} ...stuff
   */
  write(...stuff) {
    // add stuff to the print queue
    for(var i in stuff) {
      if(stuff[i].constructor != String)
        throw "TickyText#write expects String arguments."
      this.queue.push(stuff[i])
    }
    if(!this.intervalTimer)
      this.startTicking()
  }

  /**
   * Queue strings followed by a newline character.
   * @method writeln
   * @param {String} ...str
   */
  writeln(...str) {
    for(var i in str)
      this.write(str[i])
    this.write("\n")
  }

  /**
   * Begin printing characters to `target` and `this.str`.
   * @method startTicking
   */
  startTicking() {
    this.intervalTimer = setInterval(() => {
      this.tick()
    }, this.speed)
  }

  /**
   * Pause printing.
   * @method stopTicking
   */
  stopTicking() {
    if(this.intervalTimer)
      clearInterval(this.intervalTimer)
    this.intervalTimer = null

    if(this.onStopTicking)
      this.onStopTicking()
  }

  /**
   * Print a single character to the target.
   * @method tick
   */
  tick() {
    // read next character to string
    this.str += this.queue[0][this.placeInCurrent]

    // copy string to target element
    if(this.targetElement)
      this.targetElement.innerHTML = this.str

    // increment index in current string
    ++this.placeInCurrent
    // proceeed to next string at end. If no more strings stop ticking.
    if(this.placeInCurrent >= this.queue[0].length) {
      this.queue.shift()
      this.placeInCurrent = 0
      if(this.queue.length == 0)
        this.stopTicking()
    }
  }
}
module.exports = TickyText
