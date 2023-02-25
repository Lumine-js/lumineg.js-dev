const { Embed } = require("lumineg.js")
module.exports = {
  name: "eval",
  description: "",
  BotPermissions: [],
  AuthorPermissions: [],
  required: {
    developer: true 
  },
  run: async (client, mi, message) => {
    const { Embed } = require('lumineg.js')

    const process = require('child_process')

    /* eslint-disable no-eval, no-unused-vars */
    const some = mi.args.join(" ")

    const cdb = '```'

    const bot = client; //hastebin
    const msg = message;
    const { args, flags } = parseQuery(some);
    try {

      let code = some;
      let depth = 0;
      if (flags.includes("async")) {
        code = `(async() => { ${code} })()`;
      }

      if (flags.some(x => x.includes("depth"))) {
        depth = flags.find(x => x.includes("depth")).split("=")[1];

        depth = parseInt(depth, 10);
      }

      let { evaled, type } = await parseEval(
        eval(code)
      ); /* eslint-disable-line */

      if (flags.includes("silent")) return;

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, { depth });

      evaled = evaled
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);

      if (evaled.length > 2000) evaled = await client.hastebin(evaled);
      else evaled = `${evaled}`;
      const embed = new Embed()

        .setAuthor({ name: "Eval Berhasil" })

        .setColor("GREEN")
        .setDescription(`**Input**\n${cdb}js\n${code}${cdb}\n**Output**\n${cdb}js\n${evaled}${cdb}\n**Type**\n${cdb}js\n${type}${cdb}\n\nKlik Tombol Di Bawah Untuk Menghapus`)
        .setTimestamp()
      mi.send({
        content: 'Halo Kak, Ini Hasil Evalnya',
        embeds: [embed]
      })
    } catch (e) {
      const embed = new Embed()
        .setColor("RED")
        .setAuthor({ name: "Eval Eror Kak :(" })
        .setDescription(`${cdb}js\n${e}${cdb}\n\nKlik Tombol Di Bawah Untuk Menghapus`)
        .setTimestamp()
      mi.send({
        content: 'Halo Kak, Ini Hasil Evalnya',
        embeds: [embed]
      })
    }


    async function parseEval(input) {
      const isPromise =
        input instanceof Promise &&
        typeof input.then === "function" &&
        typeof input.catch === "function";

      if (isPromise) {
        input = await input;

        return {
          evaled: input,

          type: `Promise<${parseType(input)}>`
        };
      }

      return {
        evaled: input,

        type: parseType(input)
      };
    }

    function parseType(input) {
      if (input instanceof Buffer) {
        let length = Math.round(input.length / 1024 / 1024);

        let ic = "MB";

        if (!length) {
          length = Math.round(input.length / 1024);

          ic = "KB";
        }

        if (!length) {
          length = Math.round(input.length);

          ic = "Bytes";
        }

        return `Buffer (${length} ${ic})`;
      }

      return input === null || input === undefined ?
        "Void" :
        input.constructor.name;
    }

    function parseQuery(queries) {
      const args = [];

      const flags = [];

      for (const query of queries) {
        if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
        else args.push(query);
      }

      return { args, flags };
    }
  }
}