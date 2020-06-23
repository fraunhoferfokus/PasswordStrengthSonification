/** 
 * Simple Password strength estimation and checking against common passwords.
 * Strength estimation by the zxcvb algorithm by Wheeler
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import "../dep/estimator/zxcvbn.js"
import { loadScript, isBoolean } from './PWSon_HelperFunctions.js'
/** The PasswordChecker class */
export { PasswordChecker }

const commonPWFile = '../dep/estimator/100kMostCommonPWDs.js'

/** The Password Checker class */
class PasswordChecker {
    /** Create PasswordChecker instance
     * @param {boolean=} enableCommonPWCheck - enable checking against a list of common passwords
     */
    constructor(enableCommonPWCheck = true) {
        /** @private */
        this._enableCommonPWCheck = enableCommonPWCheck
        /** @private */
        this.passwordList = []
    }

    /** load password list file into passwordList array */
    init() {
        // load password ressource file
        loadScript(commonPWFile).then(text => { this.passwordList = eval(text) })
    }


    /** 
     * check password 
     * returns the password score and if the password is in the list of common passwords.
     * the check if the password is common is only performed if the class property enableCommonPWCheck is set
     * @param {string} pwd - the password to check
     * @returns {Object} PWret the return object with two properties:
     * @returns {number} PWret.score password score (between 0 and 10)
     * @returns {boolean} PWret.isCommonPW indicator if it is a common password
    */
    checkPwd(pwd) {
        let ret = {}
        ret.isCommonPW = false

        let res = zxcvbn(pwd);
        // ourScore is between 0 and 10 (capped at 10). Good from 8.0 (more than 10 years online attack.). Or from 7.0 (more than 9 months online attack)             
        let ourScore = res.guesses_log10 / 1.2
        if (ourScore > 10) { ourScore = 10 }
        if (this._enableCommonPWCheck && this.passwordList.includes(pwd)) {
            ourScore = 0
            ret.isCommonPW = true
        }
        ret.score = ourScore
        return ret
    }

    /* ----- Getters/Setters ----- */

    /** get if common password check is enabled
     * @returns {boolean} is enabled
     */
    get enableCommonPWCheck() { return this._enableCommonPWCheck }
    /** set enable/disable common password check
     * @type {boolean} 
     */
    set enableCommonPWCheck(enable) {
        if (isBoolean(enable)) this._enableCommonPWCheck = enable
    }
}
