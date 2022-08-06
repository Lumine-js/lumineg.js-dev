class Message {
  constructor(options = {}, client) {
    this.client = client
    if(this.client.advmode) {
      //Maintenance
    } else {
      this.guildId = options?.message?.serverId
      this.authorId = options?.message?.userId
      this.channelId
      this.id = options?.message?.id
      this.content = options?.message?.content
      this.embeds = options?.message?.embeds
    }
  }
}

module.exports = Message
class Message {
  constructor(options = {}, client) {
    this.client = client
    if(this.client.advmode) {
      //Maintenance
    } else {
      this.guildId = options?.message?.serverId
      this.authorId = options?.message?.userId
      this.channelId
      this.id = options?.message?.id
      this.content = options?.message?.content
      this.embeds = options?.message?.embeds
    }
  }
}

module.exports = Message
