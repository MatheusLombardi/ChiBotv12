const Discord = module.require("discord.js");
const owoify = require('owoify-js').default
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "owo",
    category: "Text",
    description: "OwOify your text",
    usage: "<text>",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const sentence = Discord.escapeMarkdown(args.join(" "));

        const owoembed = new Discord.MessageEmbed()
            .setDescription(`${message.member.displayName}: ${owoify(sentence, 'uwu')}`)
            .setColor(config.bot_color);

        message.channel.send({ embed: owoembed });

    }
};