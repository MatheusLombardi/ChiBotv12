const Discord = module.require("discord.js");
const ms = require("ms");
const botAudits = require("../../DataStore/Config/botAudits.json");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kick a user with optional reason.",
    usage: "<@user> <reason>",
    cooldown: "5",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        const toKick = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));

        if (!toKick) return message.reply('Please provide a valid user to kick.').then(s => s.delete({ timeout: 10 * 1000 }));
        if (!toKick.kickable) return message.reply('This user cannot be kicked.').then(s => s.delete({ timeout: 20 * 1000 }));
        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));
        if (toKick.roles.cache.has(guildConf.ownerRole) || toKick.roles.cache.has(guildConf.adminRole) || toKick.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t kick this user.').then(s => s.delete({ timeout: 20 * 1000 }));

        const sentence = args.join(" ");
        const spacing = sentence.split(" ");
        const final = spacing.slice(1).join(" ").split(" | ");

        const kickEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.member.displayName}`, `${message.member.user.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`<@${toKick.id}> Has been kicked by ${message.member.displayName}\n**Reason›** ${final ? final : "No reason provided."}`)
            .setColor(botAudits.Leave.Color);

        await toKick.kick(`${message.member.user.tag} kicked for: ${final}`)

        message.channel.send({ embed: kickEmbed })

    }
};