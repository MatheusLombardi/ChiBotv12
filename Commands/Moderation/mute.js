const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");

module.exports = {
    name: "mute",
    category: 'Moderation',
    description: 'Mute a user.',
    usage: '<time(optional)> <@user | userid>',
    cooldown: '3',
    aliases: ['m'],
    run: async (bot, message, args, guildConf) => {

        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));
        const toMute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!toMute) return message.reply(`No user specified, Canceling.`).then(s => s.delete({ timeout: 10 * 1000 }));
        if (toMute.hasPermission("MANAGE_MESSAGES")) return message.reply(`You can't mute that member.`).then(s => s.delete({ timeout: 10 * 1000 }));

        let MuteRole = message.guild.roles.cache.find(r => r.name === "Muted");
        if (!MuteRole) {
            let noRole = await message.channel.send("Mute role not found. Attempting to create.");
            try {
                MuteRole = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        color: "#ff1100",
                        permissions: []
                    },
                    reason: 'Muted role was not found, So I careted one!',
                });
                noRole.edit(`<@&${MuteRole.id}> Created, Updating Channel Permissions...`);
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.updateOverwrite(MuteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }

        await toMute.roles.add(MuteRole.id);
        await message.reply(`<@${toMute.id}> has been muted for ${args[1] ? 'for ' + ms(ms(args[1])) : 'indefinitely'}.`).then(s => s.delete({ timeout: 30 * 1000 }));

        if (args[1]) {
            setTimeout(async () => {
                await toMute.roles.remove(MuteRole.id)
                message.channel.send(`<@${toMute.id}> has been unmuted.`);
            }, ms(args[1]));
        }

    }
};