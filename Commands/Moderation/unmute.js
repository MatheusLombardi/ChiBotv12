const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");

module.exports = {
    name: "unmute",
    category: 'Moderation',
    description: 'unMute a user.',
    cooldown: '3',
    aliases: ['um'],
    run: async (bot, message, args, guildConf) => {

        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));
        const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!toMute) return message.reply(`No user specified, Canceling.`).then(s => s.delete({ timeout: 10 * 1000 }));
        let MuteRole = message.guild.roles.cache.find(r => r.name === "Muted");
        if (!toMute.roles.cache.has(MuteRole.id)) return message.reply(`This user is not muted.`).then(s => s.delete({ timeout: 10 * 1000 }));

        await toMute.roles.remove(MuteRole.id);
        message.reply(`<@${toMute.id}> has been unmuted by ${message.member.displayName}.`).then(s => s.delete({ timeout: 30 * 1000 }));


    }
};