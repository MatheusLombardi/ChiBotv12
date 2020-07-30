const Discord = module.require("discord.js");
const similar = require("string-similarity");
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");
const timeouttime = ms("15s");

module.exports = {
    name: "removerole",
    category: "Role",
    description: "unAssign a role to yourself.",
    usage: "rolename",
    aliases: ['rmrole'],
    run: async (bot, message, args, guildConf) => {

        message.delete();
        if (isNaN(guildConf.rolesChannel)) return message.channel.send("This command is disabled or a valid role channel has not been set.").then(s => s.delete({ timeout: 30 * 1000 }));
        if (message.channel.id != guildConf.rolesChannel) return message.reply(`Please use this command in ${message.guild.channels.cache.get(guildConf.rolesChannel)}`);

        const member = message.member;
        const PossibleRoles = message.guild.roles.cache.map(r => { return r.name; });
        const rolecase = args.join(" ");
        const words = rolecase.split(" ");
        const upperwords = [];

        for (let x = 0; x < words.length; x++) { upperwords.push(words[x].charAt(0).toUpperCase() + words[x].slice(1)); }
        const role = upperwords.join(" ");
        if (!role) return message.channel.send("Please give a role you'd like to be unassigned from.").then(s => s.delete({ timeout: timeouttime }));

        const gRole = message.guild.roles.cache.find(r => r.name === role.charAt(0).toUpperCase() + role.slice(1));

        if (!gRole) {
            let matches = similar.findBestMatch(role, PossibleRoles)
            gRole = await message.guild.roles.cache.find(r => r.name === matches.bestMatch.target);
            message.channel.send(`Couldn't find the role \`${role}\`, Assigning closest match › \`${matches.bestMatch.target}\``).then(s => s.delete({ timeout: timeouttime }));
        }
        if (!member.roles.cache.has(gRole.id)) return message.reply(`You don't have the role \`${gRole.name}\`.`).then(s => s.delete({ timeout: timeouttime }));

        const roleEmbed = new Discord.MessageEmbed()
            .setTitle(`__**Role Revoked**__`)
            .setColor(gRole.hexColor)
            .setDescription(`
            Revoked Role › ${gRole.name}
            Revoked From › ${member.displayName}
            `)
            .setFooter(`Deleting Message in ${ms(timeouttime)}`);

        await member.roles.remove(gRole.id);
        await message.channel.send({ embed: roleEmbed }).then(s => s.delete({ timeout: timeouttime }));
    }
};