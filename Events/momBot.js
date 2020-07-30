const { bot } = require("../ChiBot");

bot.on("message", async message => {
    if (!message.guild || message.author.bot) return;
    var myRegFind = RegExp(/^I\s?'?m$/i).test(message.content.split(/ +/)[0])

    var Cut = message.content.split(/ +/)[0].length
    const args = message.content.slice(Cut).split(/ +/);
    const msg = args.join(" ").trim();
    if (args.length <= 0) return;

    if (message.channel.name.includes("general")) {
        if (myRegFind == true && args[1]) {
            //0.05 = 5%F
            if (Math.random() <= 0.05) {
                message.reply(`Hi ${msg}, I'm ${bot.user.username}!`);
            }
        }
    }
});