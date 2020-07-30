const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");
const path = require('path');
const fs = require("fs");

module.exports = {
    name: "loadroles",
    category: 'Utility',
    cooldown: ms("2s"),
    description: 'Load your saved roles.',
    cooldown: '60',
    aliases: ['load'],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const member = message.member;
        let userroles = await JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/SavedRoles/", `./SavedRoles.json`), "utf8"));
        let rolecheck = userroles[member.guild.id][member.id];

        if (!rolecheck) return message.reply("Sorry, You haven't saved your roles before, Please use the save command first.");
        if (!rolecheck.roles) return message.reply("Sorry, It seems you haven't saved your roles before.");
        if (rolecheck.guild != member.guild.id) return message.reply("Sorry, You haven't saved your roles in this guild.");

        if (rolecheck.roles && rolecheck.guild == member.guild.id) {
            rolecheck.roles.forEach(r => {
                member.roles.add(r)
            });
            const loaded = new Discord.MessageEmbed()
                .setTitle(`__**Successfully Loaded Roles for ${member.displayName}**__`)
                .setColor(config.success_color)
                .addField("**Nickname ›**", `${rolecheck.nickname || "None Saved"}`)
                .addField("**Roles ›**", `${rolecheck.roles.map(r => { let guildroles = member.guild.roles.cache.get(r); return guildroles.name }).join("\n")}`);

            if (rolecheck.nickname && rolecheck.nickname != null) {
                member.setNickname(rolecheck.nickname)
            }
            message.channel.send({ embed: loaded }).then(sent => { sent.delete({ timeout: 30000 }); });
        }
    }
};
