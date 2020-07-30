const Discord = module.require("discord.js");
const ms = require("ms");
const moment = require("moment");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "deleteraffle",
    category: "Raffle",
    description: "Delete a raffle!",
    usage: "<raffle message id>",
    aliases: ['draffle', 'dgiveaway'],
    run: async (bot, message, args, guildConf) => {
        const msgID = args[0];

        if (isNaN(msgID) || !msgID) return message.reply("Please provide the message ID of the raffle you want to delete");
        bot.GiveawaysManager.delete(msgID).then(() => {
            message.channel.send(`Successfully deleted raffle with the id of ${msgID}.`).then(s => s.delete({ timeout: 30 * 1000 }));
        }).catch((err) => {
            message.channel.send(`No raffle found witht he id of ${msgID}.`).then(s => s.delete({ timeout: 30 * 1000 }));
        })
    }
};