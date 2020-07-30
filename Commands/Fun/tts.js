const discordTTS = require("discord-tts");
const ms = require("ms");

module.exports = {
    name: "tts",
    category: "Fun",
    description: "Make me talk!",
    usage: "<text>",
    cooldown: "5",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 600 * 1000 });

        const queue = bot.queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply(`You need to be in a voice channel for this command.`).then(s => s.delete({ timeout: 10 * 1000 }));
        if (args.join(" ").length > 200) return message.reply("Thats too long for me to say, Please keep it under 200 characters!").then(s => s.delete({ timeout: 10 * 1000 }));

        if (queue) return message.reply("Music playing, Please don't interrupt!").then(s => s.delete({ timeout: 10 * 1000 }));

        voiceChannel.join().then(connection => {
            //let user = message.member.user.tag.split("#")[0]
            // let stream = discordTTS.getVoiceStream(`${user} Said: ${args.join(" ")}`);
            let stream = discordTTS.getVoiceStream(`${args.join(" ")}`);
            let dispatcher = connection.play(stream);
            dispatcher.on("finish", () => voiceChannel.leave());
        });
    }
};