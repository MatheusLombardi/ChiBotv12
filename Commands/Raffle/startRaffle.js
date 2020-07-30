const Discord = module.require("discord.js");
const ms = require("ms");
const moment = require("moment");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "startraffle",
    category: "Raffle",
    description: "Start a raffle!",
    usage: "<time> <num winners> <prize>",
    aliases: ['sraffle', 'sgiveaway'],
    run: async (bot, message, args, guildConf) => {
        const Time = ms(args[0]);
        const Prize = args.slice(2).join(" ");
        const WinnerCount = parseInt(args[1]);

        if (!Time) return message.reply("Please provide a duration for the raffle!").then(s => s.delete({ timeout: 10 * 1000 }));
        if (!Prize) return message.reply("Please insert a prize for the raffle!").then(s => s.delete({ timeout: 10 * 1000 }));
        if (!WinnerCount) return message.reply("Please insert the number of winners!").then(s => s.delete({ timeout: 10 * 1000 }));

        bot.GiveawaysManager.start(message.channel, {
            time: Time,
            prize: Prize,
            winnerCount: WinnerCount
        });
    }
};