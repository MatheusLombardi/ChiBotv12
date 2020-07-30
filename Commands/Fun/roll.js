const Discord = module.require("discord.js");
const config = require("../../DataStore/Config/config.json");

module.exports = {
    name: "roll",
    category: "Fun",
    description: "Roll a die",
    usage: "20 | 4d20 | d20 ..etc",
    aliases: [],
    run: async (bot, message, args, guildConf) => {

        const messageWords = message.content.split(' ');
        const rollFlavor = messageWords.slice(2).join(' ');
        if (messageWords[0] === `${guildConf.prefix}roll`) {
            if (messageWords.length === 1) {
                // !roll
                return message.channel.send(`**${message.member.displayName} Rolled:** ${Math.floor(Math.random() * 6) + 1} ${rollFlavor}`);
            }

            let sides = messageWords[1]; // !roll 20
            let rolls = 1;
            if (!isNaN(messageWords[1][0] / 1) && messageWords[1].includes('d')) {
                // !roll 4d20
                rolls = messageWords[1].split('d')[0] / 1;
                sides = messageWords[1].split('d')[1];
            } else if (messageWords[1][0] == 'd') {
                // !roll d20
                sides = sides.slice(1);
            }
            sides = sides / 1; // convert to number
            if (isNaN(sides) || isNaN(rolls)) {
                return;
            }
            if (rolls == 0) return message.channel.send(`**${message.member.displayName}** Pretended to throw a die.`);
            if (sides == 0) return message.channel.send(`**${message.member.displayName}** rolled a zero sided die and caused a paradox, The server will now collapse, Goodbye.`);
            if (rolls > 1) {
                if (rolls > 50) return message.channel.send("No");
                const rollResults = [];
                for (let i = 0; i < rolls; i++) {
                    rollResults.push(Math.floor(Math.random() * sides) + 1);
                }
                const sum = rollResults.reduce((a, b) => a + b);
                return message.channel.send(`**${message.member.displayName} Rolled:** [${rollResults.join(", ")}] **Totalling:** ${sum} ${rollFlavor}`);
            } else {
                return message.channel.send(`**${message.member.displayName} Rolled:** ${Math.floor(Math.random() * sides) + 1} ${rollFlavor}`);
            }
        }

    }
};