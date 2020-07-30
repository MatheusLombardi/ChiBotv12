const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const ms = require("ms");
const path = require('path');
const fs = require("fs");
let userroles = JSON.parse(fs.readFileSync(path.join(__dirname, "../../DataStore/SavedRoles/", `./SavedRoles.json`), "utf8"));

module.exports = {
    name: "saveroles",
    category: 'Utility',
    cooldown: ms("2s"),
    description: 'Save your roles for later.',
    cooldown: '300',
    aliases: ['save'],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const member = message.member;
        const getroles = member.roles.cache.map(r => {
            if (r.id != member.guild.id)
                return r.id
        });

        const roles = getroles.filter(x => x !== undefined).sort((a, b) => b.position - a.position);

        if (!userroles[member.guild.id]) { userroles[member.guild.id] = {}; }

        userroles[member.guild.id][member.id] = {
            username: "",
            nickname: "",
            guild: "",
            roles: ""
        };

        userroles[member.guild.id][member.id].username = member.user.tag;
        userroles[member.guild.id][member.id].nickname = member.nickname;
        userroles[member.guild.id][member.id].guild = member.guild.id;
        userroles[member.guild.id][member.id].roles = roles;

        fs.writeFileSync(path.join(__dirname, "../../DataStore/SavedRoles/", `./SavedRoles.json`), JSON.stringify(userroles, null, 2), function (err) {
            if (err)
                message.reply(`Something went wrong, Your roles were not saved.`)
            console.log(err);
        });
        message.reply(`Successfully saved your current roles to file.`).then(sent => { sent.delete({ timeout: 30000 }); });
    }
};