const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "stop",
    category: "Music Bot",
    description: "Stop the song, and queue.",
    usage: "",
    cooldown: "10",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);

        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 1 * 60000 }));

        queue.songs = [];
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏹ stopped the music!`).then(s => s.delete({ timeout: 1 * 60000 }));
    }
};
