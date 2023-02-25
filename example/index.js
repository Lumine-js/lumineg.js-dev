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
      message.send(varena)
    }
  }

  var prefix = "/"

  const args = content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  mi.args = args
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  var command = client.ChatInputCommands.get(cmd)
  if (command) {
    try {
      /*
      if (command.required.developer) {
        if (!message.authorId === "552487001824296970") return multiInternal.send({ content: "Hanya bisa digunakan developer saja" })
      }*/

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