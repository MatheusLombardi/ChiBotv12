const Discord = module.require("discord.js");
const ms = require("ms")
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "rerollraffle",
    category: "Raffle",
    description: "Reroll a raffle for a new winner!",
    usage: "<raffle message id>",
    aliases: ['rollraffle', 'rollgiveaway'],
    run: async (bot, message, args, guildConf) => {

        const msgID = args[0];

        if (isNaN(msgID) || !msgID) return message.reply("Please provide the message ID of the raffle you want to delete");
        bot.GiveawaysManager.reroll(msgID).then(() => {
        }).catch((err) => {
            message.channel.send(`No raffle found witht he id of ${msgID}.`).then(s => s.delete({ timeout: 30 * 1000 }));
        })

    }
};