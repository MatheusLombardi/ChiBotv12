const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const fs = require("fs");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on('guildBanRemove', async (guild, user) => {
    const modLogChannel = guild.channels.cache.find(ch => ch.id === bot.settings.get(guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    const entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(audit => audit.entries.first());
    if (!entry.createdTimestamp > (Date.now() - 5000)) return;

    const LogEmbed = new Discord.MessageEmbed()
        .setTitle("__**User unBanned**__")
        .setDescription(`
        **unBanned User ›** ${entry.target.tag}
        **Used unBanned By ›** ${entry.executor.tag}
        `)
        .setColor(botAudits.Unban.Color)
        .setThumbnail(botAudits.Unban.Image)
        .setFooter(`At Time: ${moment().format("MMMM Do YYYY, h:mm a")}`);

    await modLogChannel.send({ embed: LogEmbed })
})