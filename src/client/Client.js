//========== STRUCTURE DATA
const UserClient = require("./../structure/UserClient.js")

//========== PACKAGE
const { EventEmitter } = require("node:events")
const axios = require('axios')
const WebSocket = require("ws");

//========= CLASS
class Client extends EventEmitter {
  constructor(options = {}) {
    super()

    this.token = options?.token || null;
  }

  login(token) {
    if (this.token === null) {
      if (!token) throw new Error("Token Tidak Ada")
    }
    this.startWebsocket()
  }

  destroy() {
    return this.ws.destroy()
  }

  startWebsocket() {
    let wssurl = 'wss://api.guilded.gg/v1/websocket'

    this.ws = new WebSocket(wssurl, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
    });

    this.ws.onopen = (data) => {
      console.log('Lumine.js Succesfull To Connect Websocket');
    }
    this.ws.onclose = this.ws.onerror = (e) => {
      this.ws = null
      console.log('Reconnect...')
      this.startWebsocket()
    }

    var OPCodes = {
      WELLCOME: 1
    }

    this.ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data)
      console.log(packet)
      switch (packet.type) {
        case OPCodes.WELLCOME:
          this.emit("ready", new UserClient(packet.d, this))
          const packg = require("./../../package.json")
          console.log(`====== ${pack.name}\nv${packg.version}\n\nNow Login To ${new UserClient(packet.d, this).username}\n======`)
          setInterval(function() {
            this.ws.ping()
          }.bind(this), packet.d.heartbeatIntervalMs - 3000)
          break;
      }

    };
  }

  requestAPI(method = "", params = "", data) {

  }

}

module.exports = Client
