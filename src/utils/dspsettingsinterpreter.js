const keyName = {
    drone: 'puretones',
    scale: 'musicscale'
}

const dspStateFromSettings = (appname,settings) => {
    let dspState = {}
    let appKeyName = new RegExp(String.raw`${keyName[`${appname}`]}`, 'g')
    settings.replace(appKeyName,'FaustDSP').split('\n').forEach((s) => {
        let [value, path] = s.split(' ')
        if(value && path) {
            if(appname === 'scale' && path.includes('Zita_Light'))
                path = path.replace(/\/FaustDSP/g,'')
            dspState[`${path.trim()}`] = value.trim()
        }
    })
    return dspState
}

const dspSettingsFromState = (appname,state) => {
    return Object.entries(state).map(item => {
        if(appname === 'scale' && item[0].includes('Zita_Light'))
            item[0] = item[0].replace(/\/FaustDSP/g,'')
        return `${item[1]} ${item[0]}`
    }).join('\n').replace(/FaustDSP/g,keyName[`${appname}`])
}

export { dspStateFromSettings, dspSettingsFromState }