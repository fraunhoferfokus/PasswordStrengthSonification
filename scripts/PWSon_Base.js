import { isBoolean } from './PWSon_HelperFunctions.js'
import "../dep/base/Tone.js"
export { PWSon_Base, convolutionReverbFile }

const convolutionReverbFile = '../dep/base/convReverb.mp3' // Impulse response from Lady Chapel, St. Albans Cathedral (Marcin Gorzel, Gavin Kearney, Aglaia Foteinou, Sorrel Hoare, Simon Shelley, Audiolab, University of York, www.openairlib.net)

class PWSon_Base {
    constructor(audioOutput = null) {
        /* state properties */
        this.currentScore = 0
        this.lastNumberCharacters = 0

        /* main property settings */
        this.enableCommonPWCheck = true
        this._goodEnoughThreshold = 7
        this.reverbWetAmountAfterGoodEnoughScore = 0.33
        this._enableGradualVolumeAtFewCharacters = false
        this._fadeInCharacters = 4
        //this.transferFunction = "linear"

        /* initialize main Tone.js components */
        if (audioOutput != null) {
            this.audioOutput = audioOutput
        } else {
            this.audioOutput = Tone.Master
        }
        this.volume = new Tone.Volume().connect(this.audioOutput)
        this.reverb = new Tone.Convolver(convolutionReverbFile).connect(this.volume)
        this.reverb.wet.value = 0
        this.commonPwdPlayer = new Tone.Player("../dep/base/commonPWNotification.mp3").connect(this.volume);
        this.commonPwdPlayer.volume.value = -3

        //TODO: dependency paths as properties with get/set
    }

    init() {
        Tone.Transport.start()
    }

    updateSonification(score = this.currentScore, numberCharacters = this.lastNumberCharacters) {
        if (0 <= score <= 10) {
            this.currentScore = score
        } else {
            throw Error('updateSonification: parameter score of ' + score.toString() + ' is not in allowed range 0...10')
        }
        this.lastNumberCharacters = numberCharacters

        if (this._enableGradualVolumeAtFewCharacters) {
            if (numberCharacters > this._fadeInCharacters) {
                this.volume.volume.value = 0
            }
            else {
                this.volume.volume.value = 2.0 * this._fadeInCharacters * (-this._fadeInCharacters + numberCharacters) // 2dB attenuation per fade in character
            }
        }
    }

    playCommonPWEventSound() {
        this.commonPwdPlayer.restart()
    }


    /* ----- Getters/Setters ----- */

    get enableGradualVolumeAtFewCharacters() { return this._enableGradualVolumeAtFewCharacters }
    set enableGradualVolumeAtFewCharacters(enableFadeIn) {
        if (!isBoolean(enableFadeIn)) throw Error('enableGradualVolumeAtFewCharacters: parameter must be boolean')
        this._enableGradualVolumeAtFewCharacters = enableFadeIn
        if (this._enableGradualVolumeAtFewCharacters) {
            this.updateSonification()
        } else {
            this.volume.volume.value = 0
        }
    }

    get fadeInCharacters() { return this._fadeInCharacters }
    set fadeInCharacters(numberCharacters) {
        if (!(Number.isInteger(numberCharacters) && numberCharacters > 0)) throw Error('fadeInCharacters: parameter numberCharacters must be a positive Integer')
        this._fadeInCharacters = numberCharacters
    }

    get goodEnoughThreshold() { return this._goodEnoughThreshold }
    set goodEnoughThreshold(threshold) {
        if (isNaN(threshold)) throw Error('goodEnoughThreshold: parameter mus be a number')
        this._goodEnoughThreshold = threshold
    }

    get muteAudio() { return this.volume.mute }
    set muteAudio(mute) {
        this.volume.mute = mute
    }
}