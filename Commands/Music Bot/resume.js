const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "resume",
    category: "Music Bot",
    description: "Resume playing.",
    usage: "",
    cooldown: "10",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 1 * 60000 }));

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(`${message.author} ▶ resumed the music!`).then(s => s.delete({ timeout: 1 * 60000 }));
        }

        return message.reply("The queue is not paused.").then(s => s.delete({ timeout: 1 * 60000 }));
    }
};