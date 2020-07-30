const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const fs = require("fs");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on('guildBanAdd', async (guild, user) => {
    const modLogChannel = guild.channels.cache.find(ch => ch.id === bot.settings.get(guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    const entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first());
    if ((entry.createdTimestamp > (Date.now() - 5000) && entry.target.id === user.id)) {
        const LogEmbed = new Discord.MessageEmbed()
            .setTitle("__**User Banned**__")
            .setDescription(`
            **Banned User ›** ${entry.target.tag}
            **Used Banned By ›** ${entry.executor.tag}
            **Reason for Ban ›** ${entry.reason || "No Reason Provided"}
            `)
            .setColor(botAudits.Ban.Color)
            .setThumbnail(botAudits.Ban.Image)
            .setFooter(`At Time: ${moment(entry.createdAt).format("MMMM Do YYYY, h:mm a")}`);
        await modLogChannel.send({ embed: LogEmbed })
    } else {
        console.log("Failed to find audit log..");
    }
})