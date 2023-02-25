const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync("./src/commands/chat/").forEach(dir => {
    const commands = readdirSync(`./src/commands/chat/${dir}/`).filter(file => file.endsWith(".js"));
    for (let file of commands) {
      let pull = require(`../commands/chat/${dir}/${file}`);
      if (pull.name) {
        client.Message.set(pull.name, pull);
      }
    }
  });
  console.log('[INFO] Success Register Chat Input Commands')
}