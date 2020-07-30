const Discord = module.require("discord.js");
const ms = require("ms");
const config = require("../../DataStore/Config/config.json");
const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    category: "Utility",
    description: "Display the list of commands.",
    usage: "",
    accessibility: "",
    aliases: ["h", "help", "commands"],
    run: async (bot, message, args, guildConf) => {
        const hEmbed = new Discord.MessageEmbed()
            .setColor(config.bot_color)
            .setTitle(`__**${bot.user.username} Commands**__`)
            .setThumbnail(bot.user.displayAvatarURL);

        if (!args[0]) {

            const categories = readdirSync("./Commands/");

            hEmbed.setDescription(`Command prefix is: ${guildConf.prefix}\nTo view more information on a command, use ${guildConf.prefix}help <command>.`);
            hEmbed.setFooter(`› Total Commands: ${bot.commands.size}`);

            categories.forEach(category => {
                const dir = bot.commands.filter(c => c.category === category);
                const capitalize = category.slice(0, 1).toUpperCase() + category.slice(1);

                try {
                    hEmbed.addField(`› ${capitalize} Commands [${dir.size}]:`, dir.map(c => `**__${c.name}__**`).join(" **|** "));
                } catch (e) {
                    console.log(e);
                }
            });

            return message.channel.send(hEmbed);

        } else {
            const command = bot.commands.get(
                bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase()
            );
            if (!command)
                return message.channel.send(
                    hEmbed
                        .setTitle("Invalid Command.")
                        .setDescription(
                            `Use \`${guildConf.prefix}help\` for the list of commands.`
                        )
                );

            hEmbed.setDescription(`The Bot's prefix is: \`${guildConf.prefix} Or @${bot.user.username}\`\n
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Cooldown:** ${command.cooldown ? ms(command.cooldown * 1000) : ms(2*1000)}
            **Usage:** ${command.usage ? `\` ${guildConf.prefix}${command.name} ${command.usage}\`` : `%${command.name}`}
            **Aliases:** ${command.aliases ? command.aliases.join(" | ") : "None."}
            **Description:** ${command.description || "No Description Provided"}`);

            return message.channel.send(hEmbed);
        }
    }
};