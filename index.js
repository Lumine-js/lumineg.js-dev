const Client = require("./src/client/Client.js")
const Collection = require('./src/structure/Embed.js')
const Collection = require('./src/util/Collection.js')
const Constants = require('./src/util/Constants.js')
module.exports = {
  Client: Client,
  Collection:Collection,
  Embed: Embed,
  Resolver: {
    ResolveColor: Constants.ResolveColor
  }
}
