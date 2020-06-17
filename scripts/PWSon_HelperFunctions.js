export { isBoolean, isDefined, isFunction, isObject, loadAndExecuteScript, rand }

const isBoolean = val => typeof val === 'boolean'
const isDefined = val => typeof val !== 'undefined'
const isFunction = val => typeof val === 'function'
const isObject = val => typeof val === 'object'

function loadAndExecuteScript(scriptUrl) {
    // wait until script is loaded before proceeding

    let res = loadScript(scriptUrl)
    .then(text => { eval(text) })
    
    //.catch(err => { console.log("Error in loadAndExecuteScript " + scriptUrl + " : " + err)})
    /*let res = (async () => {
        await fetch(scriptUrl)
        if (res.ok) { // if HTTP-status is 200-299
            let text = await res.text()
            eval(text)
        } else {
            throw Error("loadAndExecuteScript: HTTP-Error: " + res.status);
        }
    })().then(() => { return })*/


    /*     let res = (async () => {
        await fetch(scriptUrl)
        if (res.ok) { // if HTTP-status is 200-299
            let text = await res.text()
            eval(text)
        } else {
            throw Error("loadAndExecuteScript: HTTP-Error: " + response.status);
        }
    })().then {return}
    */
}

async function loadScript(scriptUrl) {
    let res = await fetch(scriptUrl)
    if (res.ok) { // if HTTP-status is 200-299
        let text = await res.text()
        return text
    } else {
        throw Error("loadScript: HTTP-Error: " + res.status);
    }
}

function rand(min, max) {
    return min + Math.random() * (max - min)
}
