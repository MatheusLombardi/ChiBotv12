const Discord = module.require("discord.js");
const ms = require("ms");
module.exports = {
    name: "emojilist",
    category: "Owner Only",
    description: "List all Emojis",
    usage: "",
    aliases: ["el"],
    run: async (bot, message, args) => {
        if (message.author.id !== "101789503634554880") return;

        message.delete();

        let list = [];
        message.guild.emojis.cache.map(em => {

            list.push(`${em.toString()} => :${em.name}:`)
        })

        message.channel.send(list.sort().join("\n"), { split: true })

    }
};