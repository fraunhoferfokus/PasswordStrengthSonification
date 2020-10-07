/** paths for all sound file dependencies
 * @module 
*/
export { convolutionReverbFile, commonPWNotificationFile, encryptedTransmissionFile, setConvolutionReverbFile, setCommonPWNotificationFile, setEncryptedTransmissionFile }

/** path to convolution reverb file, used by several sonifications.  
 *  Impulse response from Lady Chapel, St. Albans Cathedral by Marcin Gorzel, Gavin Kearney, Aglaia Foteinou, Sorrel Hoare, Simon Shelley, Audiolab, University of York, www.openairlib.net
*/
var convolutionReverbFile = './../dep/base/convReverb.mp3'
/** path to common PW Notification sound file.  
 *  Sound by RoganMcDougald, https://freesound.org/people/RoganMcDougald/sounds/260434/
*/
var commonPWNotificationFile = './../dep/base/commonPWNotification.mp3'
/** path to encrypted transmission file. 
 *  Space Shuttle final approach radio transmission from NASA (public domain, available at Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Space_shuttle_columbia_final_approach_20030201.ogg )
 */
var encryptedTransmissionFile = './../dep/encryptedTransmission/encryptedTransmission.mp3'

/**
 * set path to convolution reverb file
 * @param {string} filename 
 */
function setConvolutionReverbFile(filename) {
    convolutionReverbFile = filename
}
/**
 * set path to common password notification file
 * @param {string} filename 
 */
function setCommonPWNotificationFile(filename) {
    commonPWNotificationFile = filename
}
/**
 * set path to encrypted transmission file
 * @param {string} filename 
 */
function setEncryptedTransmissionFile(filename) {
    encryptedTransmissionFile = filename
}


