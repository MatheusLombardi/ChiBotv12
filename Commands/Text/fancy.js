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
        if (message.author.id !== "101789503634554880") return;

        let string = args.join(" ");

        if (!string) return message.reply(`Sorry, Can't fancify nothing, Provide text!`);

        let numPad = 8;
        numPad -= string.length / 2;
        if (numPad <= 1) {
            numPad = 1
        }

        let padding = "─".repeat(numPad / 2);

        fancytext = function (text) {
            return text.split('').map(function (a) {
                return fancy.hasOwnProperty(a) ? fancy[a] : a;
            }).join(' ');
        }

        message.channel.send(`**»─${padding}**${fancytext(string)}**${padding}─«**`)

    }
};