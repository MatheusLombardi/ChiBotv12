const Discord = module.require("discord.js");
const fs = require('fs');
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "soundeffect",
    category: "Fun",
    description: "",
    usage: "",
    cooldown: "",
    aliases: ['se'],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 600 * 1000 });

        let files = [];

        const queue = bot.queue.get(message.guild.id);
        if (queue) return message.reply("Music playing, Please don't interrupt!").then(s => s.delete({ timeout: 10 * 1000 }));
        const Sound = args.join(" ");
        const voiceChannel = message.member.voice.channel;
        const soundList = new Discord.MessageEmbed()
            .setTitle(`${message.guild.me.user.tag.split("#")[0]}'s Sound Effects`)
            .setColor(config.alert_color)
        //.setDescription(`${files.map(s => { return s }).join("\n")}`)

        fs.readdirSync("./DataStore/soundEffects/").forEach(dir => {
            const soundFiles = fs.readdirSync(`./DataStore/soundEffects/${dir}/`).filter(
                f => f.split(".").pop() === "ogg"
            )
            for (const file of soundFiles) {
                files.push({ dir: `./DataStore/soundEffects/${dir}/`, category: dir, file: file })
            }
        })

        const categories = fs.readdirSync('./DataStore/soundEffects/');
        categories.forEach(category => {
            const dir = files.filter(c => c.category === category);
            const capitalize = category.slice(0, 1).toUpperCase() + category.slice(1);
            try {
                soundList.addField(`${capitalize}`, dir.map(c => `__**${c.file.split(".")[0]}**__`).join("** | **"));
            } catch (e) {
                console.log(e);
            }
        })

        files.map(f => {
            if (f.file.split(".")[0] == Sound) {
                if (!voiceChannel) return message.channel.send({ files: [`${f.dir}${f.file}`] })
                voiceChannel.join().then(connection => {
                    let dispatcher = connection.play(`${f.dir}${f.file}`);
                    return dispatcher.on("finish", () => voiceChannel.leave());
                });
            }
        })
    }
};