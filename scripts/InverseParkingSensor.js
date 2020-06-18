import { PWSon_Base } from './PWSon_Base.js';
import "../dep/base/Tone.js"
export { InverseParkingSensor }


class InverseParkingSensor extends PWSon_Base {
    constructor(audioOutput = null) {
        super(audioOutput)
        this.synth = new Tone.Synth()
        this.synth.connect(this.reverb)
        this.noteEvent = new Tone.Event()
        this.synth.envelope.attack = 0.001
        this.synth.envelope.release = 0.2
    }

    init() {
        super.init()
        var _this = this // we need the reference to instance in inline function, where 'this' means the inline function itself
        this.noteEvent = new Tone.Event(function (time, param) { 
            _this.synth.triggerAttackRelease(440, '16n') }, 0);
            _this.noteEvent.set({
            "loop": true,
            "loopEnd": 0.01,
        });
        this.noteEvent.start();
    }

    updateSonification(score) {
        updateSonification(score, Number.MAX_SAFE_INTEGER) // covers any possible minimum number of characters that could be configured
    }

    updateSonification(score, numberCharacters) {
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