const fs = require('fs')
const supportedIcons = require('../../node_modules/cryptocurrency-icons/manifest.json').icons

function transformObjectsCryptocompareToArray (objects) {
  return Object.keys(objects).reduce((obj, key) => {
    let iconColor = null
    const symbolLower = objects[key].Symbol.toLowerCase()
    const icon = supportedIcons.includes(symbolLower) // See if the symbol matches any in the cryptocurrency-icons manifest.json
    const hasIcon = (icon) ? true : false
    const iconLocation = (hasIcon) ? `svg/color/${symbolLower}.svg` : `svg/black/generic.svg`
    const iconUri = `/static/icons/cryptocurrencies/${iconLocation}`

    // We only want the colors from the symbols that have an icon
    // We keep the color "null" for symbols that have no icon, so you can decide yourself what color to use
    if (hasIcon) {
      // Get the SVG contents, will receive a String from this
      const iconPathNodeModules = __dirname + `/../../node_modules/cryptocurrency-icons/${iconLocation}`
      const iconContents = fs.readFileSync(iconPathNodeModules, 'utf8')

      if (iconContents) {
        // Find the <circle>. This has a fill color we want to use
        const circle = iconContents.split('<circle')[1].split('/>')[0]

        if (circle) {
          // Example: Extract the fill color "#000000" from <circle fill="#000000">
          iconColor = circle.split('fill="')[1].split('"')[0] || null
        }
      }
    }

    const newObject = {
      id: objects[key].Symbol,
      name: objects[key].CoinName,
      active: objects[key].IsTrading,
      icon_uri: iconUri,
      color: iconColor
    }

    obj.push(newObject)

    // Some exchanges use "IOTA" for what is actually "MIOTA" (Binance for example)
    // So we just overwrite "IOTA" with the "MIOTA" object
    if (newObject.id === 'IOT') {
      const iotaObject = Object.assign({}, newObject)
      iotaObject.id = 'IOTA'
      iotaObject.name = 'MIOTA'
      obj.push(iotaObject)
    }

    return obj

  }, [])
}

module.exports = {
  transformObjectsCryptocompareToArray
}
