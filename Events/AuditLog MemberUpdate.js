const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const ms = require("ms");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

let options = { trackroles: true }

bot.on("guildMemberUpdate", async (oldMember, newMember) => {
    const modLogChannel = newMember.guild.channels.cache.find(ch => ch.id === bot.settings.get(newMember.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(newMember.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    if (!options) {
        options = {}
    }

    if (options[newMember.guild.id]) {
        options = options[newMember.guild.id]
    }

    if (typeof options.excludedroles === "undefined") options.excludedroles = new Array([])
    if (typeof options.trackroles === "undefined") options.trackroles = false
    if (options.trackroles !== false) {
        const oldMemberRoles = oldMember.roles.cache.keyArray()
        const newMemberRoles = newMember.roles.cache.keyArray()

        const oldRoles = oldMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !newMemberRoles.includes(x))
        const newRoles = newMemberRoles.filter(x => !options.excludedroles.includes(x)).filter(x => !oldMemberRoles.includes(x))

        const roleChanged = (newRoles.length || oldRoles.length)

        if (roleChanged) {
            let roleadded = ""
            if (newRoles.length > 0) {
                for (let i = 0; i < newRoles.length; i++) {
                    if (i > 0) roleadded += ", "
                    roleadded += `<@&${newRoles[i]}>`
                }
            }
            let roleremoved = ""
            if (oldRoles.length > 0) {
                for (let i = 0; i < oldRoles.length; i++) {
                    if (i > 0) roleremoved += ", "
                    roleremoved += `<@&${oldRoles[i]}>`
                }
            }
            var rolesEmbed = new Discord.MessageEmbed()
                .setAuthor(`${newMember.user.username}`, `${oldMember.user.displayAvatarURL({ dynamic: true })}`)
                .addFields(
                    { name: "Roles Added", value: `**${roleadded} **`, inline: true },
                    { name: "Roles Removed", value: `**${roleremoved} **`, inline: true }
                )
                .setColor(botAudits.rolesChanged.Color)

            modLogChannel.send({ embed: rolesEmbed });
        }

    }
})