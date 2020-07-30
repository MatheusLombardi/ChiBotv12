const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const fs = require("fs");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on('guildMemberRemove', async member => {
    const modLogChannel = member.guild.channels.cache.find(ch => ch.id === bot.settings.get(member.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(member.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    let leftuser = "";
    let kicker = "";
    const entry = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK' }).then(audit => audit.entries.first());
    if ((entry.createdTimestamp > (Date.now() - 5000) && entry.target.id === member.id)) {
        leftuser = entry.target.tag
        kicker = `Kicked by ${entry.executor.tag}`
    } else {
        leftuser = member.user.tag
        kicker = "Left on their own"
    }

    const LogEmbed = new Discord.MessageEmbed()
        .setTitle("__**User Left Server**__")
        .setDescription(`
        **User ›** ${leftuser}
        **Reason for Leaving ›** ${kicker}
        `)
        .setColor(botAudits.Leave.Color)
        .setThumbnail(botAudits.Leave.Image)
        .setFooter(`At Time: ${moment().format("MMMM Do YYYY, h:mm a")}`);

    await modLogChannel.send({ embed: LogEmbed })
})