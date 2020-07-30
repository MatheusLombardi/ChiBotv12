const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");
const imageSearch = require("image-search-google");
const client = new imageSearch(config.GoogleCSEID, config.GoogleAPIKey);
const options = { page: 1 }

module.exports = {
    name: "imgsearch",
    category: "Images",
    description: "Search the web for an image result",
    usage: "<search query>",
    aliases: ["img"],
    run: async (bot, message, args, guildConf) => {
        let Images;
        let ImgLength;
        let ImgNum = 0;
        const Image = new Discord.MessageEmbed();
        await client.search(args.join(" "), options).then(images => {
            Images = images;
            ImgLength = images.length;
        });

        try {

            Image.setDescription(`
            **Searched by ›** ${message.member.displayName}
            **Search Query ›** ${args.join(" ")}
            `)
            Image.setColor(config.bot_color);
            Image.setImage(Images[ImgNum].url);
            Image.setFooter(`Image ${ImgNum + 1}/${ImgLength}`);

            var imgMessage = await message.channel.send({ embed: Image })
            await imgMessage.react('🗑️');
            await imgMessage.react('◀️');
            await imgMessage.react('▶️');
            await imgMessage.react('✅');

        } catch (error) {
            console.error(error);
        }

        const filter = (reaction, user) => user.id !== bot.user.id;
        var collector = imgMessage.createReactionCollector(filter, {
            time: 300 * 1000
        });

        collector.on("collect", (reaction, user) => {
            if (!imgMessage) return;

            switch (reaction.emoji.name) {
                case "🗑️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        imgMessage.delete({ timeout: 1 * 1000 })
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "◀️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        if (ImgNum !== 0) {
                            ImgNum--;
                            Image.setImage(Images[ImgNum].url);
                            Image.setFooter(`Image ${ImgNum + 1}/${ImgLength}`);
                            imgMessage.edit({ embed: Image });
                        }
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "▶️":
                    reaction.users.remove(user).catch(console.error);
                    if (message.author.id !== user.id) return;
                    try {
                        if (ImgNum <= 8) {
                            ImgNum++;
                            Image.setImage(Images[ImgNum].url);
                            Image.setFooter(`Image ${ImgNum + 1}/${ImgLength}`);
                            imgMessage.edit({ embed: Image });
                        }
                    } catch (error) {
                        console.error(error);
                    };
                    break;

                case "✅":
                    if (message.author.id !== user.id) return;
                    imgMessage.reactions.removeAll();
                    try {
                        Image.setFooter("Collection Ended");
                        imgMessage.edit({ embed: Image });
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