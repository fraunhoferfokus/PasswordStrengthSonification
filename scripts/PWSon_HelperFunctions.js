/** Helper functions used in several modules
 * @module 
*/
export { isBoolean, isDefined, isFunction, isObject, loadScript, rand }

const isBoolean = val => typeof val === 'boolean'
const isDefined = val => typeof val !== 'undefined'
const isFunction = val => typeof val === 'function'
const isObject = val => typeof val === 'object'

/** attach external JS script to the document HEAD
 * @param {string} scriptURL - the script URL to attach
 * @returns {object} XMLHttpRequest object
*/
function attachScriptToHead(scriptUrl) {
    let req = new XMLHttpRequest()
    //req.timeout = 4000;  // Reduce default 2mn-like timeout to 4s
    req.open("GET", scriptUrl, false);
    req.send();
    return req;

}

/** load script and return its text
 * @param {string} scriptURL - the script URL to load
 * @returns {string} text of the loaded script
 */
async function loadScript(scriptUrl) {
    let res = await fetch(scriptUrl)
    if (res.ok) { // if HTTP-status is 200-299
        let text = await res.text()
        return text
    } else {
        throw Error("loadScript: HTTP-Error: " + res.status);
    }
}

/** generate random number between a minimum and maximum
 * @param {number} min - the minimum
 * @param {number} max - the maximum
 * @returns {float} the random number
 */
function rand(min, max) {
    return min + Math.random() * (max - min)
}
