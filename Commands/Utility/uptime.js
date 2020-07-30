const Discord = module.require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "uptime",
    category: "Utility",
    description: "Checks bot Uptime",
    usage: "",
    aliases: ['ut'],
    run: async (bot, message, args, guildConf) => {

        message.delete();

        const upTime = moment.duration(bot.uptime).format("D [Days], H [hrs], m [mins], s [secs]");
        const upEmbed = new Discord.MessageEmbed()
            .setTitle(`**${bot.user.username} Uptime**`)
            .setColor(config.alert_color)
            .setDescription(upTime)

        message.channel.send({ embed: upEmbed }).then(s => s.delete({ timeout: 120 * 1000 }));
    }
};