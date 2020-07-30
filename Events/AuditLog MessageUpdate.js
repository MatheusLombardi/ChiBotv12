const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on('messageUpdate', async (oldMessage, newMessage) => {
    const modLogChannel = oldMessage.guild.channels.cache.find(ch => ch.id === bot.settings.get(oldMessage.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(oldMessage.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;
    if (newMessage.channel.type == "text" && newMessage.cleanContent != oldMessage.cleanContent) {

        const LogEmbed = new Discord.MessageEmbed()
            .setAuthor(`${oldMessage.author.username}`, `${oldMessage.author.avatarURL({ dynamic: true })}`)
            .setDescription(`**Message edited in›**\n<#${oldMessage.channel.id}> [Jump to Message](${oldMessage.url})`)
            .addFields(
                { name: 'Before', value: `${oldMessage.cleanContent}` },
                { name: 'After', value: `${newMessage.cleanContent}` },
                { name: 'Additional Information', value: `**Author-ID›** ${oldMessage.member.id}\n**Channel-ID›** ${oldMessage.channel.id}\n**Message-ID›** ${oldMessage.id}` }
            )
            .setColor(botAudits.messageUpdate.Color)
            .setThumbnail(botAudits.messageUpdate.Image)
            .setFooter(`${moment().format("MMMM Do YYYY, h:mm a")}`);

        modLogChannel.send({ embed: LogEmbed })
    }
});