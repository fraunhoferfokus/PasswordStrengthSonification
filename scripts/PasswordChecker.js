//import { zxcvbn } from '../dep/estimator/zxcvbn.js';
import { loadScript } from './PWSon_HelperFunctions.js'
export { PasswordChecker }


class PasswordChecker {

    constructor(enableCommonPWCheck = true) {
        /* TODO // check if zxcvbn is existing/defined, otherwise load it */
        this.enableCommonPWCheck = enableCommonPWCheck
        this.passwordList = []
    }

    init() {
        // load password ressource file
        loadScript('../dep/estimator/100kMostCommonPWDs.js').then(text => { this.passwordList = eval(text) })
    }

    checkPwd(pwd) {
        let ret = {}
        ret.isCommonPW = false

        let res = zxcvbn(pwd);
        // ourScore is between 0 and 10 (capped at 10). Good from 8.0 (more than 10 years online attack.). Or from 7.0 (more than 9 months online attack)             
        let ourScore = res.guesses_log10 / 1.2
        if (ourScore > 10) { ourScore = 10 }
        if (this.enableCommonPWCheck && this.passwordList.includes(pwd)) {
            ourScore = 0
            ret.isCommonPW = true
        }
        ret.score = ourScore
        return ret
    }
}