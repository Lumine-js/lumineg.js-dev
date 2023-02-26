const { Collection } = require("lumineg.js")

//Express

const express = require("express")
const app = express()

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(process.env.port)

//Client

const { Client, Embed } = require("lumineg.js")
const client = new Client({
  token: process.env.token
})

client.Message = new Collection()

var ReadCommand = ['Message'];

ReadCommand.forEach(x => require(__dirname + `/handlers/${x}.js`)(client))

client.on("messageCreate", (message) => {
  var answered = false;
  const multiInternal = {
    send: (data, poi = false) => {
      var varena;
      if (!poi) varena = {
        content: null,
        embeds: []
      }
      if (data?.content) varena.content = data.content
      if (data?.embeds) varena.embeds = data.embeds
      answered = true
      //message.send(varena)
      client.sendMessage(message.channelId, varena)
    }
  }

  var prefix = "/"

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  multiInternal.args = args
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  var command = client.Message.get(cmd)
  if (command) {
    try {

      if (command.required.developer) {
        if (!message.authorId === "41oa7xPm") return multiInternal.send({ content: "Hanya bisa digunakan developer saja" })
      }

      /*setTimeout(function() {
        if (answered === false) {
          var norespond = new Embed()
            .setTitle('Maaf')
            .setDescription("Bot belum merespon apapun...")
          multiInternal.edit({ embeds: [norespond] })
        }
      }, 20000)*/
      command.run(client, multiInternal, message).catch(e => {
        const error = new Embed()
          .setTitle(e.name)
          .setDescription(e.message)
        multiInternal.send({ embeds: [error] })
      })
    } catch (e) {
      const error = new Embed()
        .setTitle(e.name)
        .setDescription(e.message)
      multiInternal.send({ embeds: [error] })
    }
  } else {
    const nocommand = new Embed()
      .setTitle('Perintah tidak tersedia')
      .setDescription('Apakah anda tidak melupakan sesuatu? **•-•**')
      .setColor('RED')
    multiInternal.send({ embeds: [nocommand] })
  }
})

client.login()