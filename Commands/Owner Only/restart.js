const ms = require("ms");
module.exports = {
  name: "restart",
  category: "Owner Only",
  description: "Restarts the Bot.",
  usage: "",
  aliases: ["rs"],
  run: async (bot, message, args) => {
    if (message.author.id !== "101789503634554880") return;

    try {
      message.delete();
      await message.reply("Restarting!");
      process.exit(1);
    } catch (e) {
      message.reply(`ERROR: ${e.message}`);
    }
  }
};