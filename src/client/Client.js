//========== STRUCTURE DATA
const Constants = require("./../util/Constants.js")

const UserClient = require("./../structure/UserClient.js")
const Message = require("./../structure/Message.js")
//========== PACKAGE
const { EventEmitter } = require("node:events")
const axios = require('axios')
const WebSocket = require("ws");
const clc = require("cli-color")
const packg = require("./../../package.json")
//========= CLASS
class Client extends EventEmitter {

  #token

  constructor(options = {}) {
    super()

    this.#token = options?.token || null;
  }

  login(token) {
    if (this.#token === null) {
      if (!token) throw new Error("Token Tidak Ada")
    }

    if (this.ws) {
      throw new Error('Client Already Run')
    }
    this.startWebsocket()
  }

  destroy() {
    return this.ws.destroy()
  }

  startWebsocket() {
    let wssurl = 'wss://www.guilded.gg/websocket/v1'

    this.ws = new WebSocket(wssurl, {
      headers: {
        Authorization: `Bearer ${this.#token}`,
        "User-Agent": `@luminejs-restapi/${packg.version} Node.js ${process.version}`
      },
    });

    this.ws.onopen = (data) => {
      this.emit("moduleLogging", 'Lumine.js Connected To Websocket')
    }

    var OPCodes = {
      WELLCOME: 1
    }

    this.ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data)


      switch (packet.op) {
        case OPCodes.WELLCOME:
          this.user = new UserClient(packet.d, this)
          this.emit("ready", this.user)
          console.log(`Bot ${clc.bold.blue(this.user.username)} telah aktif, \nKamu menggunakan ${clc.yellow.bold(packg.name)} versi ${packg.version}.\nDokumentasi bisa diperiksa pada \n${clc.blue(`https://github.com/Lumine-js/${packg.name}`)}\n\n\n\n`)
          setInterval(function() {
            this.ws.ping()
          }.bind(this), packet.d.heartbeatIntervalMs - 3000)
          break;
      }

      if (!packet?.t) return;
      this.emit('rawEvent', { t: packet.t, d: packet.d })
      switch (packet.t) {
        case "ChatMessageCreated":
          this.emit("messageCreate", new Message(packet.d, this))
          break;
      }

    };
  }

  requestAPI(method = "", params = "", data) {
    let object = {
      method: method,
      url: "https://www.guilded.gg/api/v1" + params,
      headers: {
        Authorization: `Bearer ${this.#token}`,
        "Accept": "application/json",
        "Content-type": "application/json",
        "User-Agent": `@luminejs-restapi/${packg.version} Node.js ${process.version}`
      }
    }

    if (data) object.data = data
    console.log(object)

    return axios(object).then(x =>
    {
      return x.data
    }).catch(err => {
      if (err.response.status === 400) {
        throw new Error(JSON.stringify(err))
      } else if (err.response.status === 429) {
        throw new Error("You have submitted too many requests")
      } else {
        throw new Error(err)
      }
    })
  }

  sendMessage(channelId, data) {
    if (!channelId) return new TypeError("Uknown Channel Id")
    if ((!data?.content) || (!data?.embeds)) return new TypeError("Cannot Send Empty Message")
    this.requestAPI("POST", Constants.ENDPOINTS.MESSAGE(channelId), data)
  }
}

module.exports = Client