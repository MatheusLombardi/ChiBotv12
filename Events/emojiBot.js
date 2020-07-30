const { bot } = require("../ChiBot");

bot.on("message", async message => {
    if (!message.guild || message.author.bot) return;
    if (message.channel.name.includes("general")) {
        const Trigger = Math.random();
        //0.05 = 5%
        if (Trigger <= 0.01) {
            message.channel.send(message.guild.emojis.cache.random().toString());
        }
    }
});