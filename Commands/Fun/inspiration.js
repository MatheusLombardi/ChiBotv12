const Discord = module.require("discord.js");
const ms = require("ms");
const request = require("request");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "inspiration",
    category: "Fun",
    description: "Let me Inspire you.",
    usage: "",
    cooldown: "15",
    aliases: ["inspire"],
    run: async (bot, message, args, guildConf) => {

        request("http://inspirobot.me/api?generate=true", (error, response, body) => {
            let QuoteEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.member.displayName}`, `${message.member.user.displayAvatarURL({ dynamic: true })}`)
                .setDescription("*Feel The Inspiration*")
                .setImage(body)
                .setColor(config.bot_color)
                .setTimestamp(new Date())
            message.channel.send({ embed: QuoteEmbed })
        })

    }
};