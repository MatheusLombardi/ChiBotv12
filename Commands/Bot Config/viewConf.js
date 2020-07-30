const Discord = require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");

module.exports = {
  name: "viewconf",
  category: "Bot Config",
  description: "Update server specific settings.",
  usage: "",
  cooldown: '2',
  accessibility: "Administrators",
  aliases: ["view"],
  run: async (bot, message, args, guildConf) => {
    let confArg = [];
    const adminRole = message.guild.roles.cache.find(n => n.id == guildConf.adminRole);
    if (message.author.id == "101789503634554880" || message.member.id == message.guild.ownerID || message.member.roles.cache.has(adminRole.id)) {
      const confEmbed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name}'s Configuration Settings**`)
        .setColor(config.bot_color);
      Object.keys(guildConf).map(prop => {
        confArg.push(`**${prop}** => ${guildConf[prop]} ${message.guild.channels.cache.get(guildConf[prop]) || message.guild.roles.cache.get(guildConf[prop]) || ""}`);
      });

      const FilterConf = confArg.filter(x => x !== undefined).join("\n");
      confEmbed.setDescription(`${FilterConf}`)
      message.channel.send({ embed: confEmbed });
    } else {
      return message.reply("Sorry, You can't do this.");
    }
  }
};