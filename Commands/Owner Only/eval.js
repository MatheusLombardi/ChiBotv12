const Discord = module.require("discord.js");
const ms = require("ms");

module.exports = {
  name: "eval",
  category: "Owner Only",
  description: "Code Evaluation.",
  usage: "<code>",
  aliases: [],
  run: async (bot, message, args, guildConf) => {
    if (message.author.id !== "101789503634554880") return;

    function clean(text) {
      if (typeof text === "string") {
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      } else {
        return text;
      }
    }

    const hrStart = process.hrtime();
    let hrDiff;
    hrDiff = process.hrtime(hrStart);
    const code = args.join(" ");

    try {
      let evaled = eval(code);

      if (typeof evaled !== "string") {
        evaled = require("util").inspect(evaled);
      }
      const codeEmbed = new Discord.MessageEmbed()
        .setAuthor(message.member.displayName)
        .setTitle("__**Success!**__")
        .setColor("#32a852")
        .addField("📥 Input:", `\`\`\`Javascript\n${code}\`\`\`\n`, false)
        .addField(
          "📤 Output:",
          `\`\`\`Javascript\n${clean(evaled)}\`\`\``,
          false
        )
        .setFooter(
          `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ""}${hrDiff[1] /
          1000000}ms.`
        );
      message.channel.send({
        embed: codeEmbed
      });
    } catch (err) {
      const failedEmbed = new Discord.MessageEmbed()
        .setAuthor(message.member.displayName)
        .setTitle("__**Failed!**__")
        .setColor("#a83232")
        .addField("📥 Input:", `\`\`\`Javascript\n${code}\`\`\`\n`, false)
        .addField("📤 Output:", `\`\`\`Javascript\n${clean(err)}\`\`\``, false)
        .setFooter(
          `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ""}${hrDiff[1] /
          1000000}ms.`
        );
      message.channel.send({
        embed: failedEmbed
      });
    }
  }
};