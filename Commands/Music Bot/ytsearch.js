const Discord = module.require("discord.js");
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");
const ytdl = require('ytdl-core');
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(config.YoutubeAPI)

module.exports = {
    name: "ytsearch",
    category: "Music Bot",
    description: "Search Youtube and send link in chat",
    usage: "<query>",
    cooldown: "2",
    aliases: ['yt'],
    run: async (bot, message, args, guildConf) => {

        let Vidnum = 0;

        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);
        const results = await youtube.searchVideos(search, 10);
        let VidLength = results.length;

        let songInfo = await ytdl.getInfo(results[Vidnum].url);
        let songURL = songInfo.videoDetails.video_url;

        const VidEmbed = new Discord.MessageEmbed();

        try {

            VidEmbed.setDescription(`**Searched by ›** ${message.member.displayName}\n**Search Query ›** ${args.join(" ")}`);
            VidEmbed.setColor(config.bot_color);
            VidEmbed.setFooter(`Video ${Vidnum + 1}/${VidLength}`);

            var vidMessage = await message.channel.send({ embed: VidEmbed });
            var urlMessage = await message.channel.send(songURL);

            await vidMessage.react('🗑️');
            await vidMessage.react('◀️');
            await vidMessage.react('▶️');
            await vidMessage.react('✅');

        } catch (e) {

            console.log(e);

        }

        const filter = (reaction, user) => user.id !== bot.user.id;
        var collector = vidMessage.createReactionCollector(filter, {
            time: 300 * 1000
        });

        collector.on("collect", async (reaction, user) => {
            if (!vidMessage) return;

            songInfo = await ytdl.getInfo(results[Vidnum].url);
            songURL = songInfo.videoDetails.video_url;

            switch (reaction.emoji.name) {
                case "🗑️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        vidMessage.delete({ timeout: 1 * 1000 });
                        urlMessage.delete({ timeout: 1 * 1000 });
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "◀️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        if (Vidnum !== 0) {
                            Vidnum--;
                            VidEmbed.setFooter(`Video ${Vidnum + 1}/${VidLength}`);
                            vidMessage.edit({ embed: VidEmbed });
                            urlMessage.edit(songURL);
                        }
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "▶️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        if (Vidnum <= 8) {
                            Vidnum++;
                            VidEmbed.setFooter(`Video ${Vidnum + 1}/${VidLength}`);
                            vidMessage.edit({ embed: VidEmbed });
                            urlMessage.edit(songURL);
                        }
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "✅":
                    if (message.author.id !== user.id) return;
                    vidMessage.reactions.removeAll();
                    try {
                        VidEmbed.setFooter("Collection Ended");
                        vidMessage.edit({ embed: VidEmbed });
                        collector.stop({ reason: "User Input" });
                    } catch (err) {
                        console.log(err);
                    };
                    break;

                default:
                    reaction.users.remove(user).catch(console.error);
                    break;
            }
        })
    }
};