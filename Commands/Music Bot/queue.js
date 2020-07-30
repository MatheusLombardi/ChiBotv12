const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "queue",
    category: "Music Bot",
    description: "View currently playing song.",
    usage: "",
    cooldown: "10",
    aliases: ['q'],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").then(s => s.delete({ timeout: 1 * 60000 }));

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

        let queueEmbed = new MessageEmbed()
            .setTitle(`__**${message.guild.name} Music Queue**__`)
            .setDescription(description)
            .setColor("#F8AA2A");

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed).then(s => s.delete({ timeout: 1 * 60000 }));
        });
    }
};