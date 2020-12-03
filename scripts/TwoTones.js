/** 
 * Two Tones Sonification module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { PWSon_Base } from './PWSon_Base.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.25/Tone.js'
export { TwoTones }

/**
 * Two Tones sonification class
 * @extends PWSon_Base
 */
class TwoTones extends PWSon_Base {
    /** create a sonification object
    * @param {object=} audioOutput audio output object (if not Tone.Master)
    */
    constructor(audioOutput = null) {
        super(audioOutput)
        this.synth = new Tone.Synth()
        this.synth.connect(this.reverb)
        this.synth.envelope.attack = 0.001
        this.synth.envelope.release = 0.2
        this.minFreq = 440 // A4
        this.maxFreq = 660 // E5
        this.deltaFreq = (this.maxFreq - this.minFreq) / 10 // interval per score value
    }

    /** update password sonification with new score
     * @param {number} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in).
     */
    updateSonification(score, numberCharacters = this.lastNumberCharacters) {
        super.updateSonification(score, numberCharacters)

        let freq = this.minFreq + this.deltaFreq * this.currentScore
        this.synth.triggerAttackRelease(freq, '16n')
        this.synth.triggerAttackRelease(this.maxFreq, '16n', '+16n')

        this.applyGoodEnoughScore(score)
    }

}