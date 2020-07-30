const Discord = module.require("discord.js");
const ms = require("ms");
const fetch = require('node-fetch');
const querystring = require('querystring');
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "urban",
    category: "Fun",
    description: "Search urban dictionary",
    usage: "<search query>",
    cooldown: "2",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 600 * 1000 });

        const query = querystring.stringify({ term: args.join(" ") });
        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
        if (!list) return message.channel.send(`No results found for **${args.join(" ")}**.`).then(s => s.delete({ timeout: 10 * 1000 }));
        const trim = (str, max) => ((str.length > max) ? `${string.slice(0, max - 3)}...` : str);
        const [answer] = list;

        const embed = new Discord.MessageEmbed()
            .setColor(config.bot_color)
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addFields(
                { name: 'Definition', value: trim(answer.definition, 1024) },
                { name: 'Example', value: trim(answer.example, 1024) },
                { name: 'Rating', value: `👍 ${answer.thumbs_up} | 👎 ${answer.thumbs_down}` }
            )
            .setFooter(`Searched by › ${message.member.displayName}`);

        message.channel.send({ embed: embed });
    }
};
