
const Discord = module.require("discord.js");
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");
const ytdl = require('ytdl-core');
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(config.YoutubeAPI)
const { play } = require("../../ExternalFunctions/MusicBot/music.js");


module.exports = {
    name: "playlist",
    category: "Music Bot",
    description: "Play a song from youtube.",
    usage: "<url>",
    cooldown: "10",
    aliases: ["pl"],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 30 * 1000 });

        const { channel } = message.member.voice;

        const serverQueue = bot.queue.get(message.guild.id);
        if (serverQueue && channel !== message.guild.me.voice.channel)
            return message.reply(`You must be in the same channel as ${bot.user}`).then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);

        if (!args.length)
            return message
                .reply(`Usage: ${bot.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
                .catch(console.error);
        if (!channel) return message.reply("You need to join a voice channel first!").then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);

        const permissions = channel.permissionsFor(bot.user);
        if (!permissions.has("CONNECT"))
            return message.reply("Cannot connect to voice channel, missing permissions").then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);
        if (!permissions.has("SPEAK"))
            return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!").then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);

        const search = args.join(" ");
        const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        let song = null;
        let playlist = null;
        let videos = [];

        if (urlValid) {
            try {
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(50, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply("Playlist not found.").then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);
            }
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(50, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply("Playlist not found.").then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);
            }
        }

        videos.forEach((video) => {
            song = {
                title: video.title,
                url: video.url,
                duration: video.durationSeconds
            };

            if (serverQueue) {
                serverQueue.songs.push(song);
                if (!PRUNING)
                    message.channel
                        .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
                        .then(s => s.delete({ timeout: 30 * 1000 }))
                        .catch(console.error);
            } else {
                queueConstruct.songs.push(song);
            }
        });

        let playlistEmbed = new Discord.MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setURL(playlist.url)
            .setColor(config.success_color)
            .setTimestamp();

        playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
        if (playlistEmbed.description.length >= 2048)
            playlistEmbed.description =
                playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";

        message.channel.send(`${message.author} Started a playlist`, playlistEmbed).catch(console.error);

        if (!serverQueue) bot.queue.set(message.guild.id, queueConstruct);

        if (!serverQueue) {
            try {
                queueConstruct.connection = await channel.join();
                play(queueConstruct.songs[0], message);
            } catch (error) {
                console.error(error);
                bot.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`Could not join the channel: ${error}`).then(s => s.delete({ timeout: 30 * 1000 })).catch(console.error);
            }
        }
    }
};