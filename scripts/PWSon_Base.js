export { PWSon_Base, convolutionReverbFile }

const convolutionReverbFile = '../dep/base/stalbans_a_ortf.mp3' // Impulse response from Lady Chapel, St. Albans Cathedral (Marcin Gorzel, Gavin Kearney, Aglaia Foteinou, Sorrel Hoare, Simon Shelley, Audiolab, University of York, www.openairlib.net)

class PWSon_Base {
    constructor(audioOutput = null) {
        /* main settings */
        this.currentScore = 0
        this.enableGradualVolumeAtFewCharacters = true
        this.enableCommonPWCheck = true
        this.goodEnoughThreshold = 7
        this.reverbWetAmountOnGoodEnoughScore = 0.33
        //this.transferFunction = "linear"

        /* main Tone.js components */
        if (audioOutput == null) {
            this.audioOutput = Tone.Master
        } else {
            this.audioOutput = audioOutput
        }
        this.volume = new Tone.Volume()
        this.reverb = new Tone.Convolver(convolutionReverbFile).chain(this.volume, Tone.Master)
        this.reverb.wet.value = 0
    }

    setupSonification() {
        Tone.Transport.start()
    }

    updateSonification(score) {
        if (0 <= score <= 10) {
            this.currentScore = score
        } else {
            throw Error('updateSonification: parameter _score of ' + score.toString() + ' is not in allowed range 0...10')
        }
    }

    get muteAudio() { return this.volume.mute }
    set muteAudio(mute) {
        this.volume.mute = mute
    }

    /*get volume() { return this.volume.volume.value }
    set volume(value) {
        this.volume.volume.value = value
    }*/
}