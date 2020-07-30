const Discord = module.require("discord.js");
const fetch = require("node-fetch");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "cat",
    category: "Fun",
    description: "Random Cat.",
    usage: "",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        let { cat } = await fetch('https://aws.random.cat/meow').then(r => r.json());

        const catembed = new Discord.MessageEmbed()
            .setImage(`${cat}`)
            .setColor(config.bot_color)
            .setFooter(`A cat for ${message.author.username}!`);

        message.channel.send({ embed: catembed });

    }
};