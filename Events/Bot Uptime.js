const { bot } = require("../ChiBot");
const moment = require("moment");
require("moment-duration-format");

function BotUpTime() {
    setTimeout(() => {
        const upTime = moment.duration(bot.uptime).format("Y [Y], M [M], W [W], D [D], H [h], m [m], s [s]");
        bot.user.setActivity(`Uptime: ${upTime}`)
        BotUpTime()
    }, 5 * 1000);
}

bot.on('ready', () => {
    BotUpTime()
});