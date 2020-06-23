/** 
 * Inverse Parking Sensor Sonification module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { PWSon_Base } from './PWSon_Base.js'
import '../dep/base/Tone.js'
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
        this.synth = new Tone.Synth()
        this.synth.connect(this.reverb)
        this.noteEvent = new Tone.Event()
        this.synth.envelope.attack = 0.001
        this.synth.envelope.release = 0.2
    }

    /** initialize sonification */
    init() {
        super.init()
        var _this = this // we need the reference to instance in inline function, where 'this' means the inline function itself
        this.noteEvent = new Tone.Event(function (time, param) {
            _this.synth.triggerAttackRelease(440, '16n')
        }, 0);
        _this.noteEvent.set({
            "loop": true,
            "loopEnd": 0.01,
        });
        this.noteEvent.start();
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
        });

        if (this.currentScore > this._goodEnoughThreshold) {
            this.reverb.wet.value = this.reverbWetAmountAfterGoodEnoughScore
        }
        else { this.reverb.wet.value = 0 }
    }

}