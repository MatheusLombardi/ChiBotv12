const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "shuffle",
    category: "Music Bot",
    description: "Shuffle the song queue.",
    usage: "",
    cooldown: '30',
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.channel.send("There is no queue.").then(s => s.delete({ timeout: 1 * 60000 }));

        let songs = queue.songs;
        for (let i = songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        queue.songs = songs;
        message.client.queue.set(message.guild.id, queue);
        queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).then(s => s.delete({ timeout: 1 * 60000 }));
    }
};