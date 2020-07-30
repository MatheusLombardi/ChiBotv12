const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const ms = require("ms");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on("guildMemberUpdate", async (oldMember, newMember) => {
    const modLogChannel = oldMember.guild.channels.cache.find(ch => ch.id === bot.settings.get(oldMember.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(oldMember.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    if (oldMember.nickname !== newMember.nickname) {
        const nickEmbed = new Discord.MessageEmbed()
            .setDescription(`**Nickname Changed**`)
            .setAuthor(`${newMember.user.username}`, `${newMember.user.displayAvatarURL({ dynamic: true })}`)
            .addFields(
                { name: "Old Nickname", value: `**${oldMember.nickname || oldMember.user.username}**`, inline: true },
                { name: "New Nickname", value: `**${newMember.nickname || newMember.user.username}**`, inline: true }
            )
            .setTimestamp(new Date())
            .setColor(botAudits.Nicknamechange.Color)

        modLogChannel.send({ embed: nickEmbed })
    }
})