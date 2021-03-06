# Password Strength Sonification JavaScript Library
## Purpose
This library provides JavaScript (ES6) modules to represent password strength scores with sound. Several different designs of these sonifications are implemented using [Tone.js]. They share the following features:
- representing the password score with sound
- signaling if the password is ‘good enough’ (the score surpassing a configurable threshold value, default >7 of 10)
- (optional) gradual volume fade-in at the first few characters
- (optional) warning sound if the password is one of the most common ones
- (optional) reversing the mapping polarity, i.e. at a score of 0, the sound for score 10 is played (and vice versa) 


## Password strength estimation
The password strength estimation algorithm and list of most common passwords are not part of this library, and solely at your discretion. For your convenience and a working example, we created the optional `PasswordChecker` module. It links the [zxcvbn] algorithm by Wheeler and provides a list of common passwords by [Miessner] in the `dep/estimator/` subfolder.

When using a different password strength estimation algorithm, the password score of this algorithm needs to be scaled/normalized to a value between 0 (bad) and 10 (very good) for usage with the password sonification. The method `scaleBetweenTwoRanges(...)` in the `PWSon_HelperFunctions.js` module provides this normalization in form of linear scaling.

## General usage
See the `examples/` subfolder for usage examples.
The sonification designs can be used one by one or as part of a sonification group, where all run in parallel and are controlled by an object of type  `SonificationGroup`. This class provides switching between the currently audible sonification and methods for changing parameters of all grouped sonifications.

In your HTML, include a module script in the body which imports and initializes the sonification you want to use. 
```
<script type="module">
    import { TwoTones } from './scripts/TwoTones.js'
    let sonification = new TwoTones()
    sonification.init()
```

Then, you need to register the input events of the document (e.g. password field input changed) with a corresponding callback function, which calculates the password score and updates the sonification with the score and password length (optionally, for gradual fade-in during the first few characters). If you want the warning sound about commonly used passwords to be played, you have to trigger this as well.

```
function checkPwdAndPlaySound(pwd) {
        let pwdResult = /* password score estimation of your choice */
        sonification.updateSonification(pwdResult.score, pwd.length)

        if (pwdResult.isCommonPW) {
            sonification.playCommonPWEventSound()
        }                   
    }
```


## Dependencies
In your project, you can choose to only include the dependencies for the particular sonification design you use. You in the dependencies folder `dep/` always need to include the base dependencies (Tone.js and audio files) in `dep/base/`. The other dependencies only need to be included if you use them (e.g., if you use your own password strength estimation algorithm, you don't need to include `estimator/`). In the `scripts/` folder, all files starting with `PWSon_` are mandatory, the other files contain the sonification designs.

## Development
To change the sound files used by the existing sonification designs, change the file paths in `scripts/PWSon_SoundFilePaths.js`.
New sonification designs should extend the `PWSon_Base` class.

[Tone.js]: https://tonejs.github.io/
[Miessner]: https://github.com/danielmiessler/SecLists/tree/master/Passwords/Common-Credentials
[zxcvbn]: https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/wheeler