const Discord = require("discord.js");
const { GiveawaysManager } = require("discord-giveaways");
const ms = require("ms");
const ascii = require("ascii-table");
const table = new ascii().setHeading('Servers', 'Connection Status');
const Enmap = require('enmap');
const similar = require('string-similarity');
const lib = require("./Core");
const config = require("./DataStore/Config/config.json");
const bot = new Discord.Client({ disableEveryone: true });

lib.setup(bot);

const defaultSettings = {
    prefix: '!',
    shouldLog: 'false',
    shouldWelcome: 'false',
    profanityFilter: 'false',
    ownerRole: 'please set role id',
    adminRole: 'please set role id',
    modRole: 'please set role id',
    welcomeChannel: 'please set channel id',
    rulesChannel: 'please set channel id',
    modLogChannel: 'please set channel id',
    rolesChannel: 'please set channel id',
    starboardChannel: 'please set channel id'
};

module.exports = { bot: bot, defaultSettings: defaultSettings };

const manager = new GiveawaysManager(bot, {
    storage: "./DataStore/Raffle/Raffle.json",
    updateCountdownEvery: 5 * 1000,
    default: {
        botsCanWin: false,
        embedColor: config.bot_color,
        embedColorEnd: config.success_color,
        reaction: "🎉"
    }
});

const cooldowns = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.SoundEffects = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.queue = new Map();
bot.GiveawaysManager = manager;
bot.settings = new Enmap({
    name: 'settings',
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});

['Command Handler'].forEach(handler => {
    require(`./Events/${handler}`)(bot);
});

bot.once('ready', () => {
    bot.guilds.cache.forEach((f) => {
        table.addRow(`${f.name}`, '✔ -> Connected');
    });
    console.log(table.toString());
});

bot.on('message', async message => {

    try {
        if (!message.guild || message.author.bot) return;
        const guildConf = bot.settings.ensure(message.guild.id, defaultSettings);
        const prefixMention = new RegExp(`^<@!?${bot.user.id}> `);
        const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : guildConf.prefix;

        if (message.channel.type === 'dm') return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;
        let command = bot.commands.get(cmd);
        if (!command) command = bot.commands.get(bot.aliases.get(cmd));
        if (!command) {
            let PossibleCMDs = bot.commands.map(n => { return n.name })
            if (!PossibleCMDs) PossibleCMDs = bot.aliases.map(n => { return n.name })
            let matchname = similar.findBestMatch(cmd, PossibleCMDs);
            return message.channel.send(`Invalid Command, Did you mean \`${matchname.bestMatch.target}\`?`).then(s => s.delete({ timeout: 10 * 1000 }));
        }

        if (!cooldowns.has(command.name)) { cooldowns.set(command.name, new Discord.Collection()); }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 2) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now);
                return message.reply(`Please wait ${ms(timeLeft)} before using \`${command.name}\``).then(s => s.delete({ timeout: 10 * 1000 }));
            }
        }

        if (!message.member.roles.cache.has(guildConf.ownerRole || guildConf.adminRole || guildConf.modRole)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command) {
            command.run(bot, message, args, guildConf);
        }
    } catch (e) {
        console.error(e);
    }
});

bot.login(config.token);