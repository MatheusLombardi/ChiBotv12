const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const ms = require("ms");
const botAudits = require("../DataStore/Config/botAudits.json");
const Discord = require("discord.js");

bot.on("guildMemberAdd", async member => {
    const modLogChannel = member.guild.channels.cache.find(ch => ch.id === bot.settings.get(member.guild.id, "modLogChannel"));
    if (!modLogChannel) return;
    const guildConf = await bot.settings.ensure(member.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;

    const joinEmbed = new Discord.MessageEmbed()
        .setAuthor(`${member.user.username}`, `${member.user.avatarURL({ dynamic: true })}`)
        .setDescription(`**User Joined›** ${member.user.tag}`)
        .setColor(botAudits.Join.Color)
        .setThumbnail(botAudits.Join.Image)
        .setFooter(`${moment().format("MMMM Do YYYY, h:mm a")}`);

    modLogChannel.send({ embed: joinEmbed })

})