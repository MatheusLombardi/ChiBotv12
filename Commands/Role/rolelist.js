const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "rolelist",
    category: "Role",
    description: "List of server Roles",
    usage: "",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete();
        if (isNaN(guildConf.rolesChannel)) return message.channel.send("This command is disabled or a valid role channel has not been set.").then(s => s.delete({ timeout: 30 * 1000 }));
        if (message.channel.id != guildConf.rolesChannel) return message.reply(`Please use this command in ${message.guild.channels.cache.get(guildConf.rolesChannel)}`);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, You can't do that.").then(sent => { sent.delete(15000); });

        const Roles = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => {
                if (
                    !r.permissions.has("VIEW_AUDIT_LOG") &&
                    !r.permissions.has("ADMINISTRATOR") &&
                    r.permissions.has("SEND_MESSAGES") &&
                    r.id !== message.guild.id &&
                    !r.managed &&
                    !r.name.includes("Founder") &&
                    !r.name.includes("Partner") &&
                    !r.name.includes("Trusted")
                )
                    return r.name;
            });

        const FilterRoles = Roles.filter(x => x !== undefined).join("\n");

        const RoleList = new Discord.MessageEmbed()
            .setTitle(`**${message.guild.name}'s Roles**`)
            .setDescription(Discord.escapeMarkdown(FilterRoles))
            .addField("To Assign a role:", `${guildConf.prefix}role rolename`)
            .addField("To Remove a Role:", `${guildConf.prefix}rmrole rolename`)
            .setColor(config.bot_color);
        message.channel.send({ embed: RoleList });
    }
};