const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const sarcasm = require("sarcastic-text");

module.exports = {
    name: "sarcastic",
    category: "Text",
    description: "MaKeS yOuR tExT sArCaStIc!",
    usage: "<text>",
    aliases: ['s'],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const sentence = Discord.escapeMarkdown(args.join(" "));

        const tinyembed = new Discord.MessageEmbed()
            .setDescription(`${message.member.displayName}: ${sarcasm.getSarcastic(sentence)}`)
            .setColor(config.bot_color);

        message.channel.send({ embed: tinyembed });

    }
};