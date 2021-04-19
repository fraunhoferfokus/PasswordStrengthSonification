/** 
 * Inverse Parking Sensor Sonification module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { PWSon_Base } from './PWSon_Base.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.25/Tone.js'
export { InverseParkingSensor }

/**
 * Inverse Parking Sensor sonification class
 * @extends PWSon_Base
 */
class InverseParkingSensor extends PWSon_Base {
    /** create a inverse parking sensor sonification object
    * @param {object=} audioOutput audio output object (if not Tone.Master)
    */
    constructor(audioOutput = null) {
        super(audioOutput)
        this.volEqual = new Tone.Volume(-3).connect(this.reverb); // volume component to make the sonification volumes roughly equal (before mixer)
        this.synth = new Tone.Synth()
        this.synth.connect(this.volEqual)
        this.synth.envelope.attack = 0.001
        this.synth.envelope.release = 0.2
    }

    /** initialize sonification */
    init() {
        super.init()
        var _this = this // we need the reference to instance in inline function, where 'this' means the inline function itself
        this.noteEvent = new Tone.Event((time, param) => {
            _this.synth.triggerAttackRelease(440, '16n')
        }, 0)
        this.noteEvent.set({
            "loop": true,
            "loopEnd": 0.01,
        })
        this.noteEvent.start()
    }

    /** update password sonification with new score
     * @param {number} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in).
     */
    updateSonification(score, numberCharacters = this.lastNumberCharacters) {
        super.updateSonification(score, numberCharacters)

        let deltaT = 0.0001 * Math.pow(this.currentScore, 5) / 2
        deltaT = Math.max(deltaT, 0.01) // minimal deltaT = 0.01
        this.noteEvent.set({
            "loop": true,
            "loopEnd": deltaT,
        })

        this.applyGoodEnoughScore(score)
    }

}