/** 
 * Encrypted Transmission Sonification module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { PWSon_Base } from './PWSon_Base.js'
import { scaleBetweenTwoRanges } from './PWSon_HelperFunctions.js'
import { encryptedTransmissionFile } from './PWSon_SoundFilePaths.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.25/Tone.js'
export { EncryptedTransmission }

/**
 * Encrypted Transmission sonification class
 * @extends PWSon_Base
 */
class EncryptedTransmission extends PWSon_Base {
    /** create a sonification object
    * @param {object=} audioOutput audio output object (if not Tone.Master)
    */
    constructor(audioOutput = null) {
        super(audioOutput)
        this.bitcrusher = new Tone.BitCrusher(16)
        this.distortionRadio = new Tone.Distortion()
        this.radioPlayer = new Tone.Player({ "url": encryptedTransmissionFile, "autostart": true })
        this.radioPlayer.loop = true
        this.radioPlayer.volume.value = 0
        this.radioCrossfader = new Tone.CrossFade()
        this.modulNoise = new Tone.Noise()
        this.noiseAMGain = new Tone.Gain()
        this.radioPlayer.chain(new Tone.Gain(3), new Tone.Follower(), this.noiseAMGain.gain)
        this.radioPlayer.chain(this.distortionRadio, this.bitcrusher)
        this.modulNoise.connect(this.noiseAMGain)
        this.noiseAMGain.connect(this.radioCrossfader, 0, 1)
        this.bitcrusher.connect(this.radioCrossfader, 0, 0)
        this.radioCrossfader.connect(this.reverb)
    }

    /** initialize sonification */
    init() {
        super.init()
        this.modulNoise.start()
        this.radioCrossfader.fade.value = 0
    }

    /** update password sonification with new score
     * @param {number} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in).
     */
    updateSonification(score, numberCharacters = this.lastNumberCharacters) {
        super.updateSonification(score, numberCharacters)

        if (this.radioPlayer.loaded == true && this.radioPlayer.state != "started") this.radioPlayer.start();
        // make sure that the clean radio sound is perceived loud enough, as the noise adds quite some power to the overall signal
        if (this.currentScore < 0.5) { this.radioPlayer.volume.value = 6 } else { this.radioPlayer.volume.value = 0 }
        this.distortionRadio.distortion = this.currentScore / 10.0
        this.radioCrossfader.fade.value = this.currentScore / 10.0
        let bitvalue = scaleBetweenTwoRanges(10 - this.currentScore, 0, 10, 0, 16) // invert ourScore, then scale it between 1 and 16 for bit crusher
        this.bitcrusher.bits = bitvalue

        if (this.currentScore > this._goodEnoughThreshold) {
            this.reverb.wet.value = this.reverbWetAmountAfterGoodEnoughScore
        }
        else { this.reverb.wet.value = 0 }
    }

}