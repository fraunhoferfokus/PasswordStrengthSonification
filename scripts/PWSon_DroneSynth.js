/** 
 * Drone Synthesizer module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { rand } from './PWSon_HelperFunctions.js'
import { convolutionReverbFile } from './PWSon_SoundFilePaths.js'
export { PWSon_DroneSynth }

/**
 * DroneSynth class, provides a drone synthesizer
 */
class PWSon_DroneSynth {
    /** create a drone synthesizer object */
    constructor() {
        this.rmsMeter = new Tone.Meter()
        this.masterGain = new Tone.Gain(2)
        this.masterGain.connect(this.rmsMeter)
        this.reverb = new Tone.Convolver(convolutionReverbFile).connect(this.masterGain)
        this.reverb.wet.value = 0.1
        this.hpFilter = new Tone.Filter(120, "highpass").connect(this.reverb)
        this.hpFilter.rolloff = -24
        this.compressor = new Tone.Compressor().connect(this.hpFilter)
        this.noiseSrc = new Tone.Noise("white");
        this.params = {
            filterQ: 8000,
            rolloff: -48
        }
        this.scale = ["B3", "D3", "F#3", "B4", "D4", "F#4"]//, "B5", "D5", "F#5"]
        this.scalePos = 0
        this.majorScale = false
        this.voices = []


        // populate voices
        for (let i = 0; i < 3; i++) {
            let gain = new Tone.Gain(0.8)
            let panner = new Tone.Panner()

            let filters = [
                new Tone.Frequency(this.scale[i]),
                new Tone.Frequency(this.scale[i]).transpose(+12),
                //new Tone.Frequency(this.scale[i]).transpose(-12)
            ].map(freq => {
                let filter = new Tone.Filter({
                    type: "bandpass",
                    frequency: freq.toFrequency(),
                    Q: this.params.filterQ
                })
                this.noiseSrc.connect(filter)
                filter.connect(gain)
                return filter
            });

            gain.connect(panner)
            panner.connect(this.compressor)
            this.voices[i] = { filters, gain, panner }
        }
    }

    /** return the output object
     * @returns {Object} drone synth output
     */
    getOutput() { return this.masterGain }

    /** @private */
    fluctuate() {
        for (var voice of this.voices) {
            voice.gain.gain.setTargetAtTime(rand(1, 10), Tone.now(), 0.03);
            voice.panner.pan.setTargetAtTime(rand(-0.5, 0.5), Tone.now(), 0.03);
        }
    }

     /** @private */
    adjustGain() {
        if (this.rmsMeter.getLevel() > -16) this.masterGain.gain.value *= 0.95
        //console.log(this.rmsMeter.getLevel() + "\t" + this.masterGain.gain.value)
    }

     /** @private */
    changeScale(incScalePos) {
        if (incScalePos) {
            this.scalePos += 1
            if (this.scalePos >= this.scale.length - 2) this.scalePos = 0
        }
        if (this.majorScale) {
            this.scale = ["B3", "D#3", "F#3", "B4", "D#4", "F#4"]
        }
        else {
            this.scale = ["B3", "D3", "F#3", "B4", "D4", "F#4"]
        }
        for (let i = 0; i < 3; i++) {
            this.voices[i].filters[0].frequency.value = new Tone.Frequency(this.scale[this.scalePos + i])
            this.voices[i].filters[1].frequency.value = new Tone.Frequency(this.scale[this.scalePos + i]).transpose(+12)
        }

    }

     /** start the continuous drone synth */
    play() {
        this.noiseSrc.start()
        this.reverb.wet.value = 0.1
        this.intervalAutoGain = setInterval(() => { this.adjustGain() }, 100)
        this.intervalFluctuate = setInterval(() => { this.fluctuate() }, 200)
        this.intervalChangeScale = setInterval(() => { this.changeScale(true) }, 4000)
    }

    /** stop the drone synth */
    stop() {
        this.noiseSrc.stop()
        this.reverb.wet.value = 0.0
        clearInterval(this.intervalAutoGain)
        clearInterval(this.intervalFluctuate)
        clearInterval(this.intervalChangeScale)
    }

    /** switch between major and minor scale
     * @param {boolean} enable enable major scale
     */
    enableMajorScale(enable) {
        this.majorScale = enable
        this.changeScale(false)
    }
}



