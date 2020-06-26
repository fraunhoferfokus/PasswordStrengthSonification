/** 
 * Sonification Group module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { isBoolean } from './PWSon_HelperFunctions.js'
import { PWSon_Base } from './PWSon_Base.js'
import '../dep/base/Tone.js'
export { SonificationGroup }

/**
 * Sonification group to select and switch between several sonifications
 */
class SonificationGroup {
    /** create a SonificationGroup object
     * @param {object=} audioOutput audio output object (if not Tone.Master)
     */
    constructor(audioOutput = null) {
        if (audioOutput != null) {
            this.audioOutput = audioOutput
        } else {
            this.audioOutput = Tone.Master
        }
        this.volume = new Tone.Volume().connect(this.audioOutput)

        this.currentScore = 0
        this.lastNumberCharacters = 0
        this.list = []
    }


    /** add a sonification to the sonification group 
     * @param {Object} sonification the sonification object to add, instance of / inheriting from PWSon_Base
     * @param {string} description description of the sonification (e.g., its name and/or configured parameters)
     */
    addSonification(sonification, description) {
        let son = new SonificationItem(sonification, description)
        son.volume.mute = true
        son.sonification.setAudioOutput(son.volume)
        son.volume.connect(this.volume)
        this.list.push(son)
    }

    /** initialize all sonifications of the sonification group */
    initAllSonifications() {
        this.list.forEach(element => { element.sonification.init() })
    }

    /** select the currently active (volume unmuted) sonification 
     * @param {Sonification Object} sonification the sonification object 
     * @throws {Error} Error if sonification object is not found in the group or if it is not extending PWSon_Base
    */
    selectSonificationByObject(sonification) {
        if (sonification instanceof PWSon_Base) {
            // search for the first index of the exact object
            let found = this.list.findIndex(element => { element.sonification === sonification })
            if (found != -1) {
                selectSonificationByIndex(found)
            } else { throw Error('selectSonificationByObject: sonification object not found') }
        } else { throw Error('selectSonificationByObject: sonification object needs to be instance of PWSon_Base or extending PWSon_Base') }
    }

    /** select the currently active (volume unmuted) sonification 
     * @param {string} description the description string of the sonification object 
    */
    selectSonificationByDescription(description) {
        // search for the first index with the given description
        let found = this.list.findIndex(element => { element.description == description })
        if (found != -1) {
            selectSonificationByIndex(found)
        } else { throw Error('selectSonificationByDescription: sonification with the given description not found') }

    }

    /** select the currently active (volume unmuted) sonification 
     * @param {number} number the number of the sonification object in the list
    */
    selectSonificationByIndex(number) {
        if (isNaN(number)) throw Error('selectSonificationByIndex: index must be a number')
        if (number < this.list.length) {
            // mute all sonifications, then unmute the selected one
            this.list.map(son => { son.volume.mute = true })
            this.list[number].volume.mute = false
        } else throw Error('selectSonificationByIndex: index of ' + number + ' is too large')

    }

    /** update password sonification with new score
     * @param {number=} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in)
    */
    updateSonification(score = this.currentScore, numberCharacters = this.lastNumberCharacters) {
        this.currentScore = score
        this.lastNumberCharacters = numberCharacters
        this.list.map(son => { son.sonification.updateSonification(this.currentScore, this.lastNumberCharacters) })
    }

    /** play sound to indicate a common password */
    playCommonPWEventSound() {
        this.list.map(son => { son.sonification.playCommonPWEventSound() })
    }

    /* set audio output of this SonificationGroup */
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

    /** for all sonifications in this group, enable/disable gradual volume fade-in at the first few characters 
     * @type {boolean} 
    */
    setAllEnableGradualVolumeAtFewCharacters(enableFadeIn) {
        this.list.map(son => { son.sonification.enableGradualVolumeAtFewCharacters = enableFadeIn })
    }

    /** for all sonifications in this group, set the number of characters, to which the volume is faded in
     * @type {number}
     */
    setAllFadeInCharacters(numberCharacters) {
        this.list.map(son => { son.sonification.fadeInCharacters = numberCharacters })
    }

    /** for all sonifications in this group, set the password score threshold, after which a password is considered 'good enough'
     * @type {number}
     */
    setAllGoodEnoughThreshold(threshold) {
        this.list.map(son => { son.sonification.goodEnoughThreshold = threshold })
    }

    /** for all sonifications in this group, set if the mapping polarity (score to sound) is reversed, i.e. at a score of 0, the sound for score 10 is played (and vice versa)
    * @type {boolean} 
    */
    setAllReversePolarity(reverse) {
        this.list.map(son => { son.sonification.reversePolarity = reverse })
    }
}


/** Sonification item 
 * @private
*/
class SonificationItem {
    /** create a sonification item. It contains an additional volume control for mixing/selection within the sonification group
     * @param {Object} sonification the sonification object, instance of / inheriting from PWSon_Base
     * @param {string} description description of the object (e.g., name of the sonification and/or configured parameters)
    */
    constructor(sonification, description) {
        this.sonification = sonification
        this.description = description
        this.volume = new Tone.Volume()
    }
}