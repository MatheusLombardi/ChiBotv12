const Discord = require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");

module.exports = {
  name: "setconf",
  category: "Bot Config",
  description: "Update server specific settings.",
  usage: "<prop> <target>",
  accessibility: "Administrators",
  aliases: ["set"],
  run: async (bot, message, args, guildConf) => {
    const adminRole = message.guild.roles.cache.find(n => n.id == guildConf.adminRole);
    if (message.author.id == "101789503634554880" || message.member.id == message.guild.ownerID || message.member.roles.cache.has(adminRole.id)) {
      if (!args.length)
        return message.reply("Please tell me what you'd like updated.");
      const [prop, ...value] = args;
      if (!bot.settings.has(message.guild.id, prop))
        return message.reply("This key is not in the configuration.");

      bot.settings.set(message.guild.id, value.join(" "), prop);

      const setConf = new Discord.MessageEmbed()
        .setTitle(`**${prop.toUpperCase()} has been updated.**`)
        .setColor(config.bot_color)
        .setDescription(
          `
			**Updated ${prop}**: ${value.join(" ")}`
        )
        .setFooter(`Updated by ${message.member.displayName}`);

      message.channel.send({ embed: setConf });
    } else {
      return message.reply("Sorry, You can't do this");
    }
  }
};