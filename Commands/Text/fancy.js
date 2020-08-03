const Discord = module.require("discord.js");
const ms = require("ms");
const fancy = require("../../ExternalFunctions/TextConversion/fancy.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "fancy",
    category: "Text",
    description: "»─𝐅 𝐀 𝐍 𝐂 𝐈 𝐅 𝐘   𝐘 𝐎 𝐔 𝐑   𝐓 𝐄 𝐗 𝐓─«",
    usage: "<text>",
    cooldown: "15",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        fancytext = function (text) {
            return text.split('').map(function (a) {
                return fancy.hasOwnProperty(a) ? fancy[a] : a;
            }).join(' ');
        }

        let string = fancytext(args.join(" "));
        let padding;
        let numPad = 18;
        numPad -= string.length / 2;

        if (!string) return message.reply(`Sorry, Can't fancify nothing, Provide text!`);

        try {
            if (numPad > 1) { padding = "─".repeat(numPad / 2); } else {
                padding = "─".repeat(0);
            }
            message.channel.send(`**◇»─${padding}**${string}**${padding}─«◇**`)
        } catch (error) {
            console.error(error);
        }
    }
};