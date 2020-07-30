const { bot, defaultSettings } = require("../ChiBot");
const moment = require("moment");
const config = require("../DataStore/Config/config.json");
const Discord = require("discord.js");

const profanity = [
    /n[i1]gg?[e3]r[s\$]?/i,
    /(ph|f)[a@]g[s\$]?/i,
    /(ph|f)[a@]gg[s\$]?/i,
    /(ph|f)[a@]gg?[o0][t\+][s\$]?/i,
    /w[i1]gg[e3]r[s]?/i,
    /w[e3]tb[a@]ck[s]?/i,
    /dyke[s]?/i,
    /chink[s]?(?![A-Z])/i,
    /retard[s]?(?![A-Z])/i,
    /retard[e]d?(?![A-Z])/i,
]
bot.on('message', async message => {
    if (!message.guild || message.author.bot) return;

    let badWord;
    let send = false;

    const modLogChannel = message.guild.channels.cache.find(ch => ch.id === bot.settings.get(message.guild.id, "modLogChannel"));
    const guildConf = await bot.settings.ensure(message.guild.id, defaultSettings);
    if (guildConf.shouldLog === 'false') return;
    if (guildConf.profanityFilter === 'false') return;

    const sentence = message.content.split(/ +/g);

    for (let i = 0; i < profanity.length; i++) {
        if (RegExp(profanity[i]).test(sentence) == true) {
            badWord = sentence;
            send = true;
        }
    }

    if (send == true) {

        const ProfaneEmbed = new Discord.MessageEmbed()
            .setTitle("__**Profanity Filter**__")
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .setColor(config.error_color)
            .setDescription(`
            **${message.member.displayName} Said ›** ${badWord.join(" ")}
            **In Channel ›** ${message.channel.name}
            ** At Time ›** ${moment(Date.now()).format("MMMM Do YYYY, h:mm a")}
            `)

        modLogChannel.send({ embed: ProfaneEmbed });

        message.delete();
    }
})