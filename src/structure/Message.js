class Message {
  constructor(options = {}, client) {
    this.guildId = options?.message?.serverId || null
    this.authorId = options?.message?.createdBy || null
    this.channelId = options?.message?.channelId || null
    this.id = options?.message?.id || null
    this.content = options?.message?.content || null
    this.embeds = options?.message?.embeds || null
  }

  send(data) {
    if ((!data?.content) || (!data?.embeds)) return new TypeError("Cannot Send Empty Message")
    client.requestAPI("POST", Constants.ENDPOINTS.MESSAGE(this.channelId), data)
  }
}

module.exports = Message