const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");
const path = require('path');
const fs = require('fs');

module.exports = {
    name: "warnlist",
    category: "Moderation",
    description: "Check this servers warning list.",
    cooldown: "2",
    accessibility: "Moderators +",
    aliases: [`wl`],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));

        const member = message.member;
        let warns = await JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/Warnings/", "./Warnings.json"), "utf8"));
        let getwarns = warns[member.guild.id];


        const warnlist = new Discord.MessageEmbed()
            .setColor(config.alert_color)
            .setTitle(`__**${member.guild.name}'s Warnings**__`);

        Object.entries(getwarns).forEach(([k, users]) => {
            warnlist.addField(`${users.username}`, `**User ID ›** ${users.userid || "User ID Missing"}\n**Warning Count ›** ${users.warnings}\n**Reasons ›**\n${users.reasons ? users.reasons.map(r => { return r }).join("\n") : "No reasons Found."}\n**Date ›** ${users.timestamp || "Date Missing."}`);
        });

        message.channel.send({ embed: warnlist })
    }
};
