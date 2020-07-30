const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "avatar",
    category: "Utility",
    description: "Get your own, or another users Avatar",
    usage: " | avatar @user",
    aliases: ["av"],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        if (message.mentions.users.size === 0) {
            const senderembed = new Discord.MessageEmbed();
            senderembed.setTitle(`__**Requested By: ${message.member.displayName}**__`);
            senderembed.setImage(message.author.avatarURL({ dynamic: true, size: 1024 }));
            senderembed.setColor(config.bot_color);
            senderembed.setFooter(`${message.author.username}'s Avatar.`);
            return message.channel.send({
                embed: senderembed
            });
        }

        const otherembed = new Discord.MessageEmbed();
        const themember = message.mentions.users.first();
        otherembed.setTitle(`__**Requested By: ${message.member.displayName}**__`);
        otherembed.setImage(themember.avatarURL({ dynamic: true, size: 1024 }));
        otherembed.setColor(config.bot_color);
        otherembed.setFooter(`${themember.username}'s Avatar.`);
        message.channel.send({
            embed: otherembed
        });
    }
};