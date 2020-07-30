const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "pause",
    category: "Music Bot",
    description: "Pause the currently playing song.",
    usage: "",
    cooldown: "10",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 1 * 60000 }));

        if (queue.playing) {
            queue.playing = false;
            queue.connection.dispatcher.pause(true);
            return queue.textChannel.send(`${message.author} ⏸ paused the music.`).then(s => s.delete({ timeout: 1 * 60000 }));
        }
    }
};