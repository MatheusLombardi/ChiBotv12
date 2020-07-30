const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const tiny = require("tiny-text");

module.exports = {
    name: "tinytext",
    category: "Text",
    description: "Turns your text tiny!",
    usage: "<text>",
    aliases: ['tiny'],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const sentence = Discord.escapeMarkdown(args.join(" "));

        const tinyembed = new Discord.MessageEmbed()
            .setDescription(`${message.member.displayName}: ${tiny(sentence)}`)
            .setColor(config.bot_color);

        message.channel.send({ embed: tinyembed });

    }
};
