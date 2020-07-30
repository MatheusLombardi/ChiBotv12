const { MessageEmbed } = require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "nowplaying",
    category: "Music Bot",
    description: "View currently playing song.",
    usage: "",
    aliases: ['np'],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 1 * 60000 }));
        const song = queue.songs[0];

        let nowPlaying = new MessageEmbed()
            .setTitle("Now playing")
            .setDescription(`${song.title}\n${song.url}`)
            .setColor(config.alert_color)
            .setAuthor(bot.user.tag);

        if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

        return message.channel.send(nowPlaying).then(s => s.delete({ timeout: 60 * 60000 }));
    }
};