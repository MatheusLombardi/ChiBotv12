const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "bulkdelete",
    category: "Moderation",
    description: "Bulk deletes messages.",
    usage: "<count> || @user <count>",
    accessibility: "Moderators +",
    aliases: ["bulk", "purge", "clean"],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        if (!message.member.roles.cache.has(guildConf.ownerRole) || message.member.roles.cache.has(guildConf.adminRole) || message.member.roles.cache.has(guildConf.modRole)) return message.reply('Sorry, You can\'t use this command.').then(s => s.delete({ timeout: 20 * 1000 }));

        const user = message.mentions.users.first();
        let from;

        const amount = parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
        if (!amount) return message.reply("Must specify an amount to delete!");
        if (!amount && !user)
            return message.reply("Must specify a user and amount, or just an amount, of messages to purge!");

        message.channel.messages.fetch({ limit: amount + 1 }).then(messages => {
            if (user) {
                from = `from \`${user.tag}\``;
                const filterBy = user ? user.id : bot.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            }else{
                from = "";
            }

            message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
            message.reply(`Purge Successful, Deleted \`${amount}\` messages ${from}.`)
        });
    }
};