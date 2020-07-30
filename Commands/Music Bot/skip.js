const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "skip",
    category: "Music Bot",
    description: "skip current song.",
    usage: "",
    cooldown: "10",
    aliases: ['s'],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing that I could skip for you.").then(s => s.delete({ timeout: 1 * 60000 }));

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ skipped the song`).then(s => s.delete({ timeout: 1 * 60000 }));
    }
};