import { PWSon_Base } from './PWSon_Base.js';
export { PWSon_InverseParkingSensor }


class PWSon_InverseParkingSensor extends PWSon_Base {
    constructor(audioOutput = null) {
        super(audioOutput)
        this.synth = new Tone.Synth()
        this.synth.connect(this.reverb)
        this.noteEvent = new Tone.Event()
        //this.synth.envelope.attack = 0.001
        //this.synth.envelope.release = 0.2
    }

    setupSonification() {
        super.setupSonification()
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
        super.updateSonification(score)

        let deltaT = 0.0001 * Math.pow(this.currentScore, 5) / 2
        deltaT = Math.max(deltaT, 0.01) // minimal deltaT = 0.01
        this.noteEvent.set({
            "loop": true,
            "loopEnd": deltaT,
        });

        if (this.currentScore > this.goodEnoughThreshold) {
            this.reverb.wet.value = this.reverbWetAmountOnGoodEnoughScore
        }
        else { this.reverb.wet.value = 0 }
    }

}