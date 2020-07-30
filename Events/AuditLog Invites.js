const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const ms = require("ms")
const config = require("../DataStore/Config/config.json");
const Discord = require("discord.js");

bot.on('inviteCreate', async invite => {
    const modLogChannel = invite.guild.channels.cache.find(ch => ch.id === bot.settings.get(invite.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(invite.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    const entry = await invite.guild.fetchAuditLogs({ type: 'INVITE_CREATE' }).then(audit => audit.entries.first());
    if ((entry.target.id === invite.id)) {
        const LogEmbed = new Discord.MessageEmbed()
            .setTitle("__**Invite Created**__")
            .setDescription(`
            **Created By ›** ${entry.executor.tag}
            **Invite Code ›** ${entry.changes[0].new}
            **Channel ›** ${invite.guild.channels.cache.get(entry.changes[1].new).name}
            **Max Uses ›** ${entry.changes[4].new}
            **Time until Expiration ›** ${ms(ms(entry.changes[5].new + 's'))}
            **Temporary Membership ›** ${entry.changes[6].new}
            `)
            .setColor(config.success_color)
            .setFooter(`At Time: ${moment(entry.createdAt).format("MMMM Do YYYY, h:mm a")}`);
        await modLogChannel.send({ embed: LogEmbed })
    } else {
        modLogChannel.send("An invite was created but the audit log did not provide information.");
    }
})