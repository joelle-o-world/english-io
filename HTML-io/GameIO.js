/*

HTML PROTOTYPE:
<div class='entitygame'>
  <pre class='entitygame_output'></pre>
  <input class='entitygame_input' />
</div>

*/

// Requires
const EventEmitter = require('events')
const TickyText = require('./TickyText')
const TTSQueue = require('./TTSQueue')
const ContractionQueue = require('../src/ContractionQueue')
const {sentencify} = require('../src/util/spellcheck')


/**
 * @class GameIO
 * @constructor
 * @extends EventEmitter
 * @param {Object} options
 * @param {Boolean} options.useTickyText
 * @param {Boolean} options.useResponsiveVoice
*/
/**
  * The DOM object for the GameIO's main DIV element.
  * @property div
  * @type {DOMElement}
  */
/**
  * A function used to write a string to the DIV, but not to send it to TTS.
  * Used for both game output and for user input.
  * @property monitor
  * @type {Function}
*/


class GameIO extends EventEmitter {
  constructor(options={} /*options*/) {
    super()

    this.printQueue = new ContractionQueue

    // creates the HTML/DOM interface
    this.div = this.makeHTML(options)

    this.on('output', str => this.monitor(str))

    if(options.useResponsiveVoice) {
      if(window.responsiveVoice) {
        this.ttsq = new TTSQueue(window.responsiveVoice)
        this.on('output', str => {
          this.ttsq.speak(str, 'UK English Male', {pitch:1/2})
        })
        this.ttsq.on('finish', () => this.printNext())
      } else {
        console.warn("Couldn't find responsiveVoice")
      }
    }
  }

  /**
    Create a DOM/HTML object for the interface
    @method makeHTML
    @return {DOMElement}
  */
  makeHTML({useTickyText}) {
    // create the HTML/DOM interface

    // create the main <div> element
    let main_div = document.createElement('DIV')
    main_div.className = 'entitygame'

    // create output <pre> element
    let output_pre = document.createElement('pre')
    output_pre.className = 'entitygame_output'
    main_div.appendChild(output_pre)

    // create input <input> element
    let input_input = document.createElement('input')
    input_input.className = 'entitygame_input'
    this.inputElement = input_input
    main_div.appendChild(input_input)

    // set up input event listener
    input_input.addEventListener('keypress', e => {
      if(e.keyCode == 13) {
        this.input(input_input.value)
        input_input.value = ''
      }
    })

    // set up output function
    if(!useTickyText)
      this.monitor = str => output_pre.innerHTML += str
    else {
      let ticker = new TickyText(output_pre)
      this.monitor = str => ticker.write(str)
      this.tickyText = ticker
      this.tickyText.on('finish', () => this.printNext())
    }

    // set up auto focus
    input_input.focus()
    main_div.addEventListener('click', () => input_input.focus())

    // return main <div>
    return main_div
  }

  input(str) {
    this.monitor('\n> '+str + '\n')

    /**
      An `input` event is emitted whenever the user sends input to the game.
      @event input
      @param {String} str The string entered by the user.
    */

    // emit an input event
    this.emit('input', str)
  }

  /**
    Called by external objects to write information to the string
    @method write
    @param {String} str The string to be printed
    @return {null}
  */
  write(str) {
    /**
      An `output` event is emitted whenever the game sends output to the screen.
      This event is not emitted when writing user input to the screen.
      @event output
      @param {String} str The string to be printed to the screen.
    */

    // emit an output event
    this.emit('output', str)
  }

  /**
    Send a string (with appended newline character) to the output
    @method writeln
    @param {String} str The line to output.
    @return {null}
  */
  writeln(str) {
    this.write(str+'\n')
  }
  writeSentence(str) {
    this.write(sentencify(str) + ' ')
  }

  print(...stuff0) {
    let stuff = []
    for(let o of stuff0) {
      if(o) {
        if(o.constructor == Array)
          stuff.push(...o)
        else
          stuff.push(o)
      }
    }
    stuff = stuff.filter(thing => !thing.banal)
    this.printQueue.add(...stuff)
    this.printNext()
  }
  println(...stuff) {
    this.print(...stuff, '\n')
  }

  printNext() {
    if((!this.ttsq || !this.ttsq.nowPlaying) &&
       (!this.tickyText || this.tickyText.queue.length == 0)) {
      let next = this.printQueue.next()
      if(next) {
        if(next.constructor == String)
          this.write(next)
        else if(next.isSubstitution)
          this.writeSentence(next.str(this.descriptionCtx))
        else if(next.isSentax || next.isSubjectContractedSentax)
          this.writeSentence(next.str(this.descriptionCtx))
        else
          console.warn('unable to print:', next)
      }
    }
  }
}
module.exports = GameIO
