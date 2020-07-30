const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on('messageDelete', async message => {
    const modLogChannel = message.guild.channels.cache.find(ch => ch.id === bot.settings.get(message.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(message.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first());

    let user = ""
    if (entry.extra.channel.id === message.channel.id
        && (entry.target.id === message.author.id)
        && (entry.createdTimestamp > (Date.now() - 5000))
        && (entry.extra.count >= 1)) {
        user = entry.executor.tag
    } else {
        user = message.author.tag
    }

    if (message.content.startsWith(guildConf.prefix)) return;
    if (user === bot.user.tag) return;


    const LogEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, `${message.author.avatarURL({ dynamic: true })}`)
        .setDescription(`**Message Deleted In›** <#${message.channel.id}>`)
        .addFields(
            { name: 'Deleted By', value: `${user}` },
            { name: 'Deleted Message', value: `${message.cleanContent}` },
            { name: 'Additional Information', value: `**Author-ID›** ${message.member.id}\n**Channel-ID›** ${message.channel.id}\n**Message-ID›** ${message.id}` }
        )
        .setColor(botAudits.messageDelete.Color)
        .setThumbnail(botAudits.messageDelete.Image)
        .setFooter(`${moment().format("MMMM Do YYYY, h:mm a")}`);

    await modLogChannel.send({ embed: LogEmbed })
})