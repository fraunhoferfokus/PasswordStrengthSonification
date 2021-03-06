/** 
 * Password Sonification base module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { isBoolean } from './PWSon_HelperFunctions.js'
import { convolutionReverbFile, commonPWNotificationFile } from './PWSon_SoundFilePaths.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.25/Tone.js'
export { PWSon_Base }

/**
 * Base class for all password sonifications
 */
class PWSon_Base {
    /** create a password sonification object
     * @param {object=} audioOutput audio output object (if not Tone.Master)
     */
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
        this._reversePolarity = false
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
        this.commonPwdPlayer = new Tone.Player(commonPWNotificationFile).connect(this.volume);
        this.commonPwdPlayer.volume.value = -3
    }

    /** initialize password sonification */
    init() {
        Tone.Transport.start()
    }

    /** update password sonification with new score
     * @param {number} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in)
    */
    updateSonification(score = this.currentScore, numberCharacters = this.lastNumberCharacters) {
        if (score < 0 || score > 10) throw Error('updateSonification: parameter score of ' + score.toString() + ' is not in allowed range 0...10')

        if (this._reversePolarity) score = 10 - score
        this.currentScore = score

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
    /** play sound to indicate a common password */
    playCommonPWEventSound() {
        this.commonPwdPlayer.restart()
    }

    /** set audio output of this sonification (useful for use within SonificationGroups) 
     * @param {Object} audioOutput the audio output object
    */
    setAudioOutput(audioOutput) {
        this.volume.disconnect(this.audioOutput)
        this.audioOutput = audioOutput
        this.volume.connect(this.audioOutput)
    }

    /** mute / unmute audio 
     * @param {boolean} mute mute audio
    */
    muteAudio(mute) {
        if (!isBoolean(mute)) throw Error('muteAudio: parameter must be boolean')
        this.volume.mute = mute
    }


    /* ----- Getters/Setters ----- */

    /** get if gradual volume fade-in at the first few characters is enabled */
    get enableGradualVolumeAtFewCharacters() { return this._enableGradualVolumeAtFewCharacters }
    /** enable/disable gradual volume fade-in at the first few characters 
     * @type {boolean} 
    */
    set enableGradualVolumeAtFewCharacters(enableFadeIn) {
        if (!isBoolean(enableFadeIn)) throw Error('enableGradualVolumeAtFewCharacters: parameter must be boolean')
        this._enableGradualVolumeAtFewCharacters = enableFadeIn
        if (!this._enableGradualVolumeAtFewCharacters) this.volume.volume.value = 0
        this.updateSonification()
    }

    /** get the number of characters, to which the volume is faded in */
    get fadeInCharacters() { return this._fadeInCharacters }
    /** set the number of characters, to which the volume is faded in
     * @type {number}
     */
    set fadeInCharacters(numberCharacters) {
        if (!(Number.isInteger(numberCharacters) && numberCharacters > 0)) throw Error('fadeInCharacters: parameter numberCharacters must be a positive Integer')
        this._fadeInCharacters = numberCharacters
        this.updateSonification()
    }

    /** get the password score threshold, after which a password is considered 'good enough' */
    get goodEnoughThreshold() { return this._goodEnoughThreshold }
    /** set the password score threshold, after which a password is considered 'good enough'
     * @type {number}
     */
    set goodEnoughThreshold(threshold) {
        if (isNaN(threshold)) throw Error('goodEnoughThreshold: parameter mus be a number')
        this._goodEnoughThreshold = threshold
        this.updateSonification()
    }

    /** get if the mapping polarity (score to sound) is reversed, i.e. at a score of 0, the sound for score 10 is played (and vice versa) */
    get reversePolarity() { return this._reversePolarity }
    /** set if the mapping polarity (score to sound) is reversed, i.e. at a score of 0, the sound for score 10 is played (and vice versa)
     * @type {boolean} 
    */
    set reversePolarity(reverse) {
        if (!isBoolean(reverse)) throw Error('reversePolarity: parameter must be boolean')
        this._reversePolarity = reverse
        // if polarity was reversed and is set back to normal, reverse the last saved current score back to normal as well
        if (!this._reversePolarity) this.currentScore = 10 - this.currentScore
        this.updateSonification()
    }
}