const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "invite",
    category: "Utility",
    description: "Generate a single use invite link.",
    usage: "",
    cooldown: '300',
    aliases: ["inv"],
    run: async (bot, message, args, guildConf) => {
        message.delete();

        if (!guildConf.rulesChannel) return message.reply(`No rules channel set, Invites cannot be created.`);

        message.guild.channels.cache.get(guildConf.rulesChannel).createInvite({
            temporary: true,
            maxAge: 600,
            maxUses: 1,
            unique: true,
            reason: `${message.member.user.tag} used the Invite command.`
        }).then(invite => message.reply(`\nHere you go!\nThis invite will expire after ${invite.maxUses} use(s) or 10 minutes.\nhttps://discord.gg/${invite.code}`).then(sent => sent.delete({ timeout: 600000 })))
    }
};