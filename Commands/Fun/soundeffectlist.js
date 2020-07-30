const Discord = module.require("discord.js");
const fs = require('fs');
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "soundeffectlist",
    category: "Fun",
    description: "",
    usage: "",
    cooldown: "",
    aliases: ['sel'],
    run: async (bot, message, args, guildConf) => {

        message.delete({ timeout: 600 * 1000 });

        let files = [];
        const soundList = new Discord.MessageEmbed()
            .setTitle(`${message.guild.me.user.tag.split("#")[0]}'s Sound Effects`)
            .setColor(config.alert_color)

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
        message.channel.send({ embed: soundList });
    }
};