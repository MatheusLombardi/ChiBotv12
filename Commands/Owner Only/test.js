const Discord = module.require("discord.js");
const ms = require("ms");
const fancy = require("../../ExternalFunctions/TextConversion/fancy.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "pad",
    category: "Owner Only",
    description: "",
    usage: "",
    cooldown: "",
    aliases: [],
    run: async (bot, message, args, guildConf) => {
        if (message.author.id !== "101789503634554880") return;

        let string = args.join(" ");
        let numPad = 8;
        numPad -= string.length / 2;
        if (numPad <= 1) {
            numPad = 1
        }
        console.log(numPad);
        let padding = "─".repeat(numPad / 2);

        fancytext = function (text) {
            return text.split('').map(function (a) {
                return fancy.hasOwnProperty(a) ? fancy[a] : a;
            }).join(' ');
        }

        message.channel.send(`**»─${padding}**${fancytext(string)}**${padding}─«**`)

    }
};