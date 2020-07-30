const Discord = module.require("discord.js");
const ms = require("ms");
const botAudits = require("../../DataStore/Config/botAudits.json");

module.exports = {
    name: "ban",
    category: "Moderation",
    description: "Ban a user with optional reason.",
    usage: "<@user> <time> <reason>",
    cooldown: "5",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        const toBan = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));

        if (!toBan) return message.reply('Please provide a valid user to Ban.').then(s => s.delete({ timeout: 10 * 1000 }));
        if (!toBan.bannable) return message.reply('This user cannot be Banned.').then(s => s.delete({ timeout: 20 * 1000 }));
        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));
        if (toBan.roles.cache.has(guildConf.ownerRole) || toBan.roles.cache.has(guildConf.adminRole) || toBan.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t Ban this user.').then(s => s.delete({ timeout: 20 * 1000 }));

        const time = args[1];

        if (!time) return message.reply('Provide a valid number of days. Eg: 1').then(s => s.delete({ timeout: 20 * 1000 }));

        const sentence = args.join(" ");
        const spacing = sentence.split(" ");
        const final = spacing.slice(2).join(" ").split(" | ");

        const BanEmbed = new Discord.MessageEmbed()
            .setAuthor(`${message.member.displayName}`, `${message.member.user.displayAvatarURL({ dynamic: true })}`)
            .setDescription(`<@${toBan.id}> Has been Banned by ${message.member.displayName}\n**For›** ${time} Day(s)\n**Reason›** ${final ? final : "No reason provided."}`)
            .setColor(botAudits.Leave.Color);

        await toBan.ban({
            days: `${time}`,
            reason: `${message.member.user.tag} Baned for: ${final}`
        })

        message.channel.send({ embed: BanEmbed })

    }
};